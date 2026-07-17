import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Form";


export default function Edit({ auth, brand }) {


    const { data, setData, put, processing, errors } = useForm({

        name: brand.name || "",
        description: brand.description || "",
        status: brand.status ? 1 : 0,
        sort_order: brand.sort_order || 0,

    });



    const submit = (e) => {

        e.preventDefault();

        put(route("brands.update", brand.id));

    };



    return (

        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Brand
                </h2>
            }
        >

            <Head title="Edit Brand" />


            <div className="py-8">

                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">


                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">


                        <div className="p-6">


                            <Form

                                data={data}

                                setData={setData}

                                errors={errors}

                                processing={processing}

                                submit={submit}

                                buttonText="Update Brand"

                            />


                        </div>


                    </div>


                </div>


            </div>


        </AuthenticatedLayout>

    );
}