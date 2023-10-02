import React from 'react';
import TableRow from './TableRow';

function DataTable({ data, modifyData, deleteData }) {
    return (
        <section className="table-container">
            <table id="data-table">
                {/* ... table headers ... */}
                <tbody>
                    {data.map((item) => (
                        <TableRow 
                            key={item._id} 
                            item={item} 
                            modifyData={modifyData} 
                            deleteData={deleteData} 
                        />
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default DataTable;
