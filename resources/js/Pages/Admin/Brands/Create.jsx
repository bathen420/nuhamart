import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "./Form";


export default function Create({ auth }) {


    const { data, setData, post, processing, errors } = useForm({

        name: "",
        description: "",
        status: 1,
        sort_order: 0,

    });



    const submit = (e) => {

        e.preventDefault();


        post(route("brands.store"));

    };



    return (

        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Brand
                </h2>
            }
        >

            <Head title="Create Brand" />


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

                                buttonText="Create Brand"

                            />


                        </div>


                    </div>


                </div>


            </div>


        </AuthenticatedLayout>

    );
}