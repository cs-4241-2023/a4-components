
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function init_binding_group(group) {
        let _inputs;
        return {
            /* push */ p(...inputs) {
                _inputs = inputs;
                _inputs.forEach(input => group.push(input));
            },
            /* remove */ r() {
                _inputs.forEach(input => group.splice(group.indexOf(input), 1));
            }
        };
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\button.svelte generated by Svelte v3.59.2 */

    const file$1 = "src\\button.svelte";

    function create_fragment$1(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", "svelte-1gbgmeq");
    			add_location(button, file$1, 13, 0, 152);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (104:1) <Button on:click={addCharacter}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Add/Modify character");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(104:1) <Button on:click={addCharacter}>",
    		ctx
    	});

    	return block;
    }

    // (107:1) <Button on:click={getCharacters}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Get characters");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(107:1) <Button on:click={getCharacters}>",
    		ctx
    	});

    	return block;
    }

    // (124:3) {#if characters.length != 0}
    function create_if_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*characters*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*characters, group*/ 48) {
    				each_value = /*characters*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(124:3) {#if characters.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (125:4) {#each characters as product}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let input;
    	let input_value_value;
    	let value_has_changed = false;
    	let t0;
    	let td1;
    	let t1_value = /*product*/ ctx[17].name + "";
    	let t1;
    	let t2;
    	let td2;
    	let t3_value = /*product*/ ctx[17].attack + "";
    	let t3;
    	let t4;
    	let td3;
    	let t5_value = /*product*/ ctx[17].defense + "";
    	let t5;
    	let t6;
    	let td4;
    	let t7_value = /*product*/ ctx[17].speed + "";
    	let t7;
    	let t8;
    	let td5;
    	let t9_value = /*product*/ ctx[17].average + "";
    	let t9;
    	let t10;
    	let td6;
    	let t11_value = /*product*/ ctx[17].recommended + "";
    	let t11;
    	let t12;
    	let binding_group;
    	let mounted;
    	let dispose;
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[14][0]);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			input = element("input");
    			t0 = space();
    			td1 = element("td");
    			t1 = text(t1_value);
    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td3 = element("td");
    			t5 = text(t5_value);
    			t6 = space();
    			td4 = element("td");
    			t7 = text(t7_value);
    			t8 = space();
    			td5 = element("td");
    			t9 = text(t9_value);
    			t10 = space();
    			td6 = element("td");
    			t11 = text(t11_value);
    			t12 = space();
    			attr_dev(input, "type", "radio");
    			input.__value = input_value_value = /*product*/ ctx[17].name;
    			input.value = input.__value;
    			add_location(input, file, 126, 8, 2910);
    			add_location(td0, file, 126, 4, 2906);
    			add_location(td1, file, 127, 4, 2981);
    			add_location(td2, file, 128, 4, 3009);
    			add_location(td3, file, 129, 4, 3039);
    			add_location(td4, file, 130, 4, 3070);
    			add_location(td5, file, 131, 4, 3099);
    			add_location(td6, file, 132, 4, 3130);
    			add_location(tr, file, 125, 3, 2897);
    			binding_group.p(input);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, input);
    			input.checked = input.__value === /*group*/ ctx[5];
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(td4, t7);
    			append_dev(tr, t8);
    			append_dev(tr, td5);
    			append_dev(td5, t9);
    			append_dev(tr, t10);
    			append_dev(tr, td6);
    			append_dev(td6, t11);
    			append_dev(tr, t12);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[13]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*characters*/ 16 && input_value_value !== (input_value_value = /*product*/ ctx[17].name)) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    				value_has_changed = true;
    			}

    			if (value_has_changed || dirty & /*group, characters*/ 48) {
    				input.checked = input.__value === /*group*/ ctx[5];
    			}

    			if (dirty & /*characters*/ 16 && t1_value !== (t1_value = /*product*/ ctx[17].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*characters*/ 16 && t3_value !== (t3_value = /*product*/ ctx[17].attack + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*characters*/ 16 && t5_value !== (t5_value = /*product*/ ctx[17].defense + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*characters*/ 16 && t7_value !== (t7_value = /*product*/ ctx[17].speed + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*characters*/ 16 && t9_value !== (t9_value = /*product*/ ctx[17].average + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*characters*/ 16 && t11_value !== (t11_value = /*product*/ ctx[17].recommended + "")) set_data_dev(t11, t11_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			binding_group.r();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(125:4) {#each characters as product}",
    		ctx
    	});

    	return block;
    }

    // (140:1) <Button on:click={deleteCharacter}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Delete character");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(140:1) <Button on:click={deleteCharacter}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let h1;
    	let t1;
    	let hr;
    	let t2;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let section0;
    	let div2;
    	let label0;
    	let t6;
    	let input0;
    	let t7;
    	let div3;
    	let label1;
    	let t9;
    	let input1;
    	let t10;
    	let div4;
    	let label2;
    	let t12;
    	let input2;
    	let t13;
    	let div5;
    	let label3;
    	let t15;
    	let input3;
    	let t16;
    	let button0;
    	let t17;
    	let br0;
    	let t18;
    	let br1;
    	let t19;
    	let button1;
    	let t20;
    	let section1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t21;
    	let th1;
    	let t23;
    	let th2;
    	let t25;
    	let th3;
    	let t27;
    	let th4;
    	let t29;
    	let th5;
    	let t31;
    	let th6;
    	let t33;
    	let t34;
    	let section2;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*addCharacter*/ ctx[6]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*getCharacters*/ ctx[7]);
    	let if_block = /*characters*/ ctx[4].length != 0 && create_if_block(ctx);

    	button2 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*deleteCharacter*/ ctx[8]);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Character Creator";
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			div0 = element("div");
    			img0 = element("img");
    			t3 = space();
    			div1 = element("div");
    			img1 = element("img");
    			t4 = space();
    			section0 = element("section");
    			div2 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t6 = space();
    			input0 = element("input");
    			t7 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Attack";
    			t9 = space();
    			input1 = element("input");
    			t10 = space();
    			div4 = element("div");
    			label2 = element("label");
    			label2.textContent = "Defense";
    			t12 = space();
    			input2 = element("input");
    			t13 = space();
    			div5 = element("div");
    			label3 = element("label");
    			label3.textContent = "Speed";
    			t15 = space();
    			input3 = element("input");
    			t16 = space();
    			create_component(button0.$$.fragment);
    			t17 = space();
    			br0 = element("br");
    			t18 = space();
    			br1 = element("br");
    			t19 = space();
    			create_component(button1.$$.fragment);
    			t20 = space();
    			section1 = element("section");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			t21 = space();
    			th1 = element("th");
    			th1.textContent = "Name";
    			t23 = space();
    			th2 = element("th");
    			th2.textContent = "Attack";
    			t25 = space();
    			th3 = element("th");
    			th3.textContent = "Defense";
    			t27 = space();
    			th4 = element("th");
    			th4.textContent = "Speed";
    			t29 = space();
    			th5 = element("th");
    			th5.textContent = "Average";
    			t31 = space();
    			th6 = element("th");
    			th6.textContent = "Recommended";
    			t33 = space();
    			if (if_block) if_block.c();
    			t34 = space();
    			section2 = element("section");
    			create_component(button2.$$.fragment);
    			add_location(h1, file, 75, 0, 1635);
    			add_location(hr, file, 76, 0, 1663);
    			if (!src_url_equal(img0.src, img0_src_value = "swords.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "width", "140");
    			attr_dev(img0, "height", "140");
    			attr_dev(img0, "alt", "swords");
    			add_location(img0, file, 78, 2, 1695);
    			attr_dev(div0, "class", "leftimg");
    			add_location(div0, file, 77, 1, 1669);
    			if (!src_url_equal(img1.src, img1_src_value = "swords.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "width", "140");
    			attr_dev(img1, "height", "140");
    			attr_dev(img1, "alt", "swords");
    			add_location(img1, file, 81, 2, 1792);
    			attr_dev(div1, "class", "rightimg");
    			add_location(div1, file, 80, 1, 1765);
    			set_style(label0, "background-color", "white");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file, 85, 2, 1880);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "name");
    			add_location(input0, file, 86, 2, 1946);
    			add_location(div2, file, 84, 1, 1872);
    			set_style(label1, "background-color", "lightcoral");
    			attr_dev(label1, "for", "attack");
    			add_location(label1, file, 90, 2, 2014);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "id", "attack");
    			add_location(input1, file, 91, 2, 2090);
    			add_location(div3, file, 89, 1, 2006);
    			set_style(label2, "background-color", "skyblue");
    			attr_dev(label2, "for", "defense");
    			add_location(label2, file, 95, 2, 2164);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "id", "defense");
    			add_location(input2, file, 96, 2, 2239);
    			add_location(div4, file, 94, 1, 2156);
    			set_style(label3, "background-color", "lightgreen");
    			attr_dev(label3, "for", "speed");
    			add_location(label3, file, 100, 2, 2315);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "id", "speed");
    			add_location(input3, file, 101, 2, 2389);
    			add_location(div5, file, 99, 1, 2307);
    			add_location(br0, file, 104, 1, 2515);
    			add_location(br1, file, 105, 1, 2521);
    			add_location(section0, file, 83, 0, 1861);
    			add_location(th0, file, 114, 6, 2653);
    			add_location(th1, file, 115, 6, 2669);
    			add_location(th2, file, 116, 6, 2691);
    			add_location(th3, file, 117, 6, 2715);
    			add_location(th4, file, 118, 6, 2740);
    			add_location(th5, file, 119, 6, 2762);
    			add_location(th6, file, 120, 6, 2787);
    			add_location(tr, file, 113, 3, 2642);
    			add_location(thead, file, 112, 2, 2631);
    			attr_dev(table, "class", "char");
    			add_location(table, file, 111, 1, 2608);
    			add_location(section1, file, 110, 0, 2597);
    			add_location(section2, file, 138, 0, 3211);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, img0);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img1);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, section0, anchor);
    			append_dev(section0, div2);
    			append_dev(div2, label0);
    			append_dev(div2, t6);
    			append_dev(div2, input0);
    			set_input_value(input0, /*name*/ ctx[0]);
    			append_dev(section0, t7);
    			append_dev(section0, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t9);
    			append_dev(div3, input1);
    			set_input_value(input1, /*attack*/ ctx[1]);
    			append_dev(section0, t10);
    			append_dev(section0, div4);
    			append_dev(div4, label2);
    			append_dev(div4, t12);
    			append_dev(div4, input2);
    			set_input_value(input2, /*defense*/ ctx[2]);
    			append_dev(section0, t13);
    			append_dev(section0, div5);
    			append_dev(div5, label3);
    			append_dev(div5, t15);
    			append_dev(div5, input3);
    			set_input_value(input3, /*speed*/ ctx[3]);
    			append_dev(section0, t16);
    			mount_component(button0, section0, null);
    			append_dev(section0, t17);
    			append_dev(section0, br0);
    			append_dev(section0, t18);
    			append_dev(section0, br1);
    			append_dev(section0, t19);
    			mount_component(button1, section0, null);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t21);
    			append_dev(tr, th1);
    			append_dev(tr, t23);
    			append_dev(tr, th2);
    			append_dev(tr, t25);
    			append_dev(tr, th3);
    			append_dev(tr, t27);
    			append_dev(tr, th4);
    			append_dev(tr, t29);
    			append_dev(tr, th5);
    			append_dev(tr, t31);
    			append_dev(tr, th6);
    			append_dev(table, t33);
    			if (if_block) if_block.m(table, null);
    			insert_dev(target, t34, anchor);
    			insert_dev(target, section2, anchor);
    			mount_component(button2, section2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1 && input0.value !== /*name*/ ctx[0]) {
    				set_input_value(input0, /*name*/ ctx[0]);
    			}

    			if (dirty & /*attack*/ 2 && to_number(input1.value) !== /*attack*/ ctx[1]) {
    				set_input_value(input1, /*attack*/ ctx[1]);
    			}

    			if (dirty & /*defense*/ 4 && to_number(input2.value) !== /*defense*/ ctx[2]) {
    				set_input_value(input2, /*defense*/ ctx[2]);
    			}

    			if (dirty & /*speed*/ 8 && to_number(input3.value) !== /*speed*/ ctx[3]) {
    				set_input_value(input3, /*speed*/ ctx[3]);
    			}

    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (/*characters*/ ctx[4].length != 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(table, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(section0);
    			destroy_component(button0);
    			destroy_component(button1);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(section1);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t34);
    			if (detaching) detach_dev(section2);
    			destroy_component(button2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let name = '';
    	let attack = 0;
    	let defense = 0;
    	let speed = 0;
    	let average = 0;
    	let recommended = '';
    	let characters = [];
    	let group = "game";

    	const addCharacter = event => {
    		const json = {
    			name,
    			attack,
    			defense,
    			speed,
    			action: 'create'
    		};

    		const body = JSON.stringify(json);

    		let header = {
    			'Content-Type': 'application/json',
    			'Access-Control-Allow-Origin': "*",
    			'Access-Control-Allow-Credentials': 'true'
    		};

    		console.log(body);

    		fetch('http://localhost:3002/submit', { method: 'POST', headers: header, body }).then(response => response.json()).then(result => {
    			$$invalidate(4, characters = result);
    		});

    		$$invalidate(0, name = '');
    		$$invalidate(1, attack = 0);
    		$$invalidate(2, defense = 0);
    		$$invalidate(3, speed = 0);
    	};

    	function getCharacters() {
    		let header = {
    			'Content-Type': 'application/json',
    			'Access-Control-Allow-Origin': "*",
    			'Access-Control-Allow-Credentials': 'true'
    		};

    		fetch('http://localhost:3002/results', { method: 'GET', headers: header }).then(response => response.json()).then(result => {
    			$$invalidate(4, characters = result);
    		});
    	}

    	function deleteCharacter() {
    		const json = { name: group, action: 'delete' };
    		const body = JSON.stringify(json);

    		let header = {
    			'Content-Type': 'application/json',
    			'Access-Control-Allow-Origin': "*",
    			'Access-Control-Allow-Credentials': 'true'
    		};

    		fetch('http://localhost:3002/submit', { method: 'POST', headers: header, body }).then(response => response.json()).then(result => {
    			$$invalidate(4, characters = result);
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	function input1_input_handler() {
    		attack = to_number(this.value);
    		$$invalidate(1, attack);
    	}

    	function input2_input_handler() {
    		defense = to_number(this.value);
    		$$invalidate(2, defense);
    	}

    	function input3_input_handler() {
    		speed = to_number(this.value);
    		$$invalidate(3, speed);
    	}

    	function input_change_handler() {
    		group = this.__value;
    		$$invalidate(5, group);
    	}

    	$$self.$capture_state = () => ({
    		Button,
    		name,
    		attack,
    		defense,
    		speed,
    		average,
    		recommended,
    		characters,
    		group,
    		addCharacter,
    		getCharacters,
    		deleteCharacter
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('attack' in $$props) $$invalidate(1, attack = $$props.attack);
    		if ('defense' in $$props) $$invalidate(2, defense = $$props.defense);
    		if ('speed' in $$props) $$invalidate(3, speed = $$props.speed);
    		if ('average' in $$props) average = $$props.average;
    		if ('recommended' in $$props) recommended = $$props.recommended;
    		if ('characters' in $$props) $$invalidate(4, characters = $$props.characters);
    		if ('group' in $$props) $$invalidate(5, group = $$props.group);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		attack,
    		defense,
    		speed,
    		characters,
    		group,
    		addCharacter,
    		getCharacters,
    		deleteCharacter,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input_change_handler,
    		$$binding_groups
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
