import React, { useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { AutoComplete } from 'primereact/autocomplete';
import { FileUpload, FileUploadSelectEvent, ItemTemplateOptions } from 'primereact/fileupload';
import { useClients } from '@/hooks/useClients';
import { Cliente } from '@/app/types';
export default function OrdenTrabajoModal({ visible, onHide }) {
    const { clients } = useClients();
    const [selectedClient, setSelectedClient] = useState<Cliente | null>(null) // Cliente seleccionado
    const [filteredClients, setFilteredClients] = useState<Cliente[]>([]) // Lista filtrada
    const [cedulaInput, setCedulaInput] = useState(''); // Valor del input de cédula
    const fileUploadRef = useRef<FileUpload>(null);

    // Filtrar clientes según la cédula ingresada
    const searchClients = (event) => {
        const query = event.query.toLowerCase()
        const results = clients.filter(client =>
            client.cedula.toLowerCase().includes(query)
        )
        setFilteredClients(results)
    }

    // Manejar selección de cliente
    const handleClientSelect = (e) => {
        const client = e.value // Objeto completo del cliente
        setSelectedClient(client) // Guardamos el cliente seleccionado
        setCedulaInput(client.cedula)
    }

    const handleCedulaChange = (e) => {
        setCedulaInput(e.value); // Actualizamos el valor del input de cédula
        setSelectedClient(null); // Limpiamos el cliente seleccionado
        console.log('Cliente seleccionado:', selectedClient)
    };

    const categories = [
        { key: 'limpiaparabrisas', name: 'Limpiaparabrisas' },
        { key: 'espejos', name: 'Espejos' },
        { key: 'luces', name: 'Luces' },
        { key: 'placas', name: 'Placas' },
        { key: 'emblemas', name: 'Emblemas' },
        { key: 'radio', name: 'Radio' },
        { key: 'control_alarma', name: 'Control de Alarma' },
        { key: 'tapetes', name: 'Tapetes' },
        { key: 'aire_acondicionado', name: 'Aire Acondicionado' },
        { key: 'matricula', name: 'Matrícula' },
        { key: 'herramientas', name: 'Herramientas' },
        { key: 'tuerca_seguridad', name: 'Tuerca de Seguridad' },
        { key: 'gata', name: 'Gata' },
        { key: 'llave_ruedas', name: 'Llave de Ruedas' },
        { key: 'extintor', name: 'Extintor' },
        { key: 'encendedor', name: 'Encendedor' },
        { key: 'antena', name: 'Antena' },
        { key: 'llanta_emergencia', name: 'Llanta de Emergencia' }
    ];
    const [formData, setFormData] = useState({
        fechaIngreso: null as Date | null,
        fechaSalida: null as Date | null,
        vehiculo: null,
        operaciones: '',
        totalMO: '',
        totalRep: '',
        iva: '',
        total: '',
        comentarios: '',
        formaPago: '',
        estado: 'Pendiente',
        elementosIngreso: [] as string[]
    });

    const onCategoryChange = (e) => {
        let selected = [...formData.elementosIngreso];
        if (e.checked) {
            selected.push(e.value.key);
        } else {
            selected = selected.filter((item) => item !== e.value.key);
        }
        setFormData({ ...formData, elementosIngreso: selected });
    };
    const emptyTemplate = (text) => {
        return (
            <div className="flex align-items-center flex-column" onClick={() => {
                const fileInput = document.querySelector('.p-fileupload input[type="file"]');
                if (fileInput) fileInput.click(); // Solo hace click si el input existe
            }}>
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Imagen {text}
                </span>
            </div>
        );
    };
    return (
        <Dialog header="Nueva Orden de Trabajo" visible={visible} style={{ width: '90vw' }} onHide={onHide} modal>
            <fieldset className="border rounded-lg p-3 mb-4 border-gray-400">
                <legend className="font-bold px-2">Cliente</legend>
                <div className="grid grid-cols-3 gap-4 mt-1">
                    <span className='p-float-label'>
                        <AutoComplete
                            value={selectedClient?.cedula || cedulaInput}
                            suggestions={filteredClients}
                            completeMethod={searchClients}
                            field="cedula"
                            onChange={handleCedulaChange}
                            onSelect={handleClientSelect}
                        />
                        <label htmlFor="client">Cédula</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText
                            value={selectedClient?.nombre || undefined}
                            disabled={!!selectedClient}
                        />
                        <label htmlFor="nombre">Nombre</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText
                            value={selectedClient?.direccion || undefined}
                            disabled={!!selectedClient}
                        />
                        <label htmlFor="direccion">Dirección</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText
                            value={selectedClient?.email || undefined}
                            disabled={!!selectedClient}
                        />
                        <label htmlFor="correo">Correo Electrónico</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText
                            value={selectedClient?.telefono || undefined}
                            disabled={!!selectedClient}
                        />
                        <label htmlFor="telefono">Teléfono</label>
                    </span>
                </div>
            </fieldset>

            <fieldset className="border rounded-lg p-3 mb-4 border-gray-400">
                <legend className="font-bold px-2">Vehículo</legend>
                <div className="grid grid-cols-3 gap-4 mt-1">
                    <span className='p-float-label'>
                        <InputText />
                        <label htmlFor="client">Placa</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText />
                        <label htmlFor="client">Marca</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText />
                        <label htmlFor="client">Modelo</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText type='number' />
                        <label htmlFor="client">Año</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText />
                        <label htmlFor="client">Chasis</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText />
                        <label htmlFor="client">Motor</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText />
                        <label htmlFor="client">Color</label>
                    </span>



                    <span className='p-float-label'>
                        <InputText type='number' />
                        <label htmlFor="client">Kilometraje</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText type='float' />
                        <label htmlFor="client">Combustible</label>
                    </span>



                </div>
                <div className="!grid grid-cols-4 gap-4 mt-4 w-full items-center">
                    {categories.map((category) => (
                        <div key={category.key} className="flex items-center">
                            <Checkbox
                                inputId={category.key}
                                name="category"
                                value={category}
                                onChange={onCategoryChange}
                                checked={formData.elementosIngreso.includes(category.key)}
                                className="mr-2"
                            />
                            <label htmlFor={category.key} className="whitespace-nowrap">{category.name}</label>
                        </div>
                    ))}
                </div>
            </fieldset>
            <fieldset className='border rounded-lg p-3 mb-4 border-gray-400'>
                <legend className='font-bold px-2'>Fotos del vehículo</legend>
                <div className='!grid grid-cols-3 gap-4 mt-1'>
                    <FileUpload accept='image/*' headerTemplate={() => null} emptyTemplate={emptyTemplate('Frontal')} chooseLabel='Frontal' />
                    <FileUpload accept='image/*' headerTemplate={() => null} emptyTemplate={emptyTemplate('Trasera')} chooseLabel='Trasera' />
                    <FileUpload accept='image/*' headerTemplate={() => null} emptyTemplate={emptyTemplate('Lateral Izq')} chooseLabel='LateralIzq' />
                    <FileUpload accept='image/*' headerTemplate={() => null} emptyTemplate={emptyTemplate('Lateral Der')} chooseLabel='LateralDer' />
                    <FileUpload accept='image/*' headerTemplate={() => null} emptyTemplate={emptyTemplate('Superior')} chooseLabel='Motor' />
                    <FileUpload accept='image/*' headerTemplate={() => null} emptyTemplate={emptyTemplate('Interior')} chooseLabel='Interior' />
                </div>
            </fieldset>
            <fieldset className='border rounded-lg p-3 mb-4 border-gray-400'>
                <legend className="font-bold px-2">Datos de Orden de Trabajo</legend>
                <div className="!grid grid-cols-2 gap-4 mt-1">
                    <span className='p-float-label'>
                        <Calendar className='w-full' />
                        <label htmlFor="client">Fecha de Ingreso</label>
                    </span>

                    <span className='p-float-label'>
                        <Calendar className='w-full' />
                        <label htmlFor="client">Fecha de Salida</label>
                    </span>

                    <span className='p-float-label col-span-2'>
                        <InputText className='w-full' />
                        <label htmlFor="client">Operaciones Solicitadas</label>
                    </span>

                    <Dropdown className='w-full' placeholder='Método de pago' />


                    <span className='p-float-label'>
                        <InputText className='w-full' />
                        <label htmlFor="client">Abono</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText className='w-full' />
                        <label htmlFor="client">Saldo</label>
                    </span>

                    <span className='p-float-label'>
                        <InputText className='w-full' />
                        <label htmlFor="client">Total</label>
                    </span>

                </div>
            </fieldset>
        </Dialog>
    );
}
