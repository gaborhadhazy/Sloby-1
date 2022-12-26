import Layout from "../../components/layout";
import Head from "next/head";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {Star} from "../../components/star";
import Link from "next/link";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import {useRouter} from "next/router";
import {getURL, githubLogin, googleLogin, loggedIn} from "../../lib/helpers";

const isEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

export default function Login() {
    const [errorMsg, setErrorMsg] = useState("");
    const usernameRef = React.useRef<HTMLInputElement>(null)
    const supabase = useSupabaseClient()
    const session = useSession()

    let router = useRouter();

    async function onSubmit(event: any) {
        event.preventDefault();

        const { data, error } = await supabase
            .from('profiles')
            .update({ username: usernameRef.current?.value })
            .eq('id', session?.user?.id)


        if (error) {
            setErrorMsg(error.message);
        }

        console.log(data, error)
        if (router.query.redirectedFrom) {
            await router.push(router.query.redirectedFrom.toString())
            return;
        }
        await router.push('/editor/dashboard')
    }

    return (
        <Layout>
            <Head>
                <title>Sloby Login</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main>
                {Array.from({length: 20}, (_, i) => <Star key={i}/>)}
                <div className={"flex-center flex-col gap-8 lg:p-40"}>
                    <div className={"flex-center text-center flex-row bg-dark-dark rounded-lg w-2/3 z-50"}>
                        <form onSubmit={onSubmit} className={"w-1/2 flex flex-col justify-between m-16 gap-8"}>
                            <p className={"font-semibold text-5xl"}>Pick a Username</p>
                            <label className="block flex flex-col gap-2">
                                <span className="text-left">Your brand new shiny username</span>
                                <input type="text"
                                       name="username"
                                       ref={usernameRef}
                                       className={`px-6 rounded-full mt-1 block w-full rounded-md bg-dark-mid border-transparent focus:border-gray-500 focus:bg-dark-dark focus:ring-0`}
                                       placeholder="Enter your amazing username"
                                />
                            </label>
                            <button type="submit"
                                    className={"flex-center mx-auto bg-green-dark w-1/4 p-3 rounded-full"}>Submit
                            </button>
                            <div className={`${errorMsg ? "p-2 px-6" : ""} bg-red-mid rounded-xl`}>
                                {errorMsg}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </Layout>
    )
}
