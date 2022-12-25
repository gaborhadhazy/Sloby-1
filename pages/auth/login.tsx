import Layout from "../../components/layout";
import Head from "next/head";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {Star} from "../../components/star";
import Link from "next/link";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useRouter} from "next/router";
import {getURL, loggedIn} from "../../lib/helpers";

const isEmail = (email: string) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

export default function Login() {
    const [hidePassword, setHidePassword] = useState(true);
    const [emailStyles, setEmailStyles] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const emailRef = React.useRef<HTMLInputElement>(null)
    const supabase = useSupabaseClient()

    let router = useRouter();

    function onHidePassword() {
        setHidePassword(!hidePassword);
    }

    function onEmailChange(event: any) {
        if (isEmail(event.target.value)) {
            setEmailStyles("!border-green-mid");
        } else {
            setEmailStyles("!border-red-mid");
        }
    }

    function verifyEmailState() {
        if (emailStyles.startsWith("!border-red-mid")) {
            setEmailStyles("!border-red-mid animate-shake");
        }
    }

    async function onSubmit(event: any) {
        event.preventDefault();
        if (emailStyles.startsWith("!border-red-mid") || emailRef.current?.value === '') {
            setErrorMsg('Please enter a valid email address')
            setEmailStyles("!border-red-mid !animate-shake");
            return;
        }

        const {data, error} = await supabase.auth.signInWithPassword({
                email: event.currentTarget.email.value,
                password: event.currentTarget.password.value,
            },
        )

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

    async function googleLogin(event: any) {
        event.preventDefault();
        const {data, error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: getURL(),
            }
        })
    }

    useEffect(() => {
        loggedIn(supabase, router, "/editor/dashboard");
    });

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
                    <div className={"flex flex-row bg-dark-dark rounded-lg w-2/3 z-50"}>
                        <div className={"bg-dark-mid flex-center rounded-l-lg w-1/2"}>
                            <Image alt="Sloby Logo" src={"/images/Sloby Logo Dark.svg"} width={400} height={500}/>
                        </div>
                        <form onSubmit={onSubmit} className={"w-1/2 flex flex-col justify-between m-16 gap-8"}>
                            <p className={"font-semibold text-5xl"}>Log In</p>
                            <div className={"flex items-center w-full rounded-lg bg-white p-2 gap-3 hover:cursor-pointer"} onClick={googleLogin}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"/>
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"/>
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"/>
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"/>
                                    <path d="M1 1h22v22H1z" fill="none"/>
                                </svg>
                                <span className={"text-gray-500 font-medium"}>Continue with Google</span>
                            </div>
                            <label className="block flex flex-col gap-2">
                                <span className="">Your email</span>
                                <input type="email"
                                       name="email"
                                       className={`${emailStyles} px-6 rounded-full mt-1 block w-full rounded-md bg-dark-mid border-transparent focus:border-gray-500 focus:bg-dark-dark focus:ring-0`}
                                       ref={emailRef}
                                       placeholder="Enter your email"
                                       onChange={onEmailChange}
                                       onBlur={verifyEmailState}
                                />
                            </label>
                            <label className="block flex flex-col gap-2">
                                <span className="">Your password</span>
                                <input type={hidePassword ? "password" : "text"}
                                       name="password"
                                       className="px-6 rounded-full mt-1 block w-full rounded-md bg-dark-mid border-transparent focus:border-gray-500 focus:bg-dark-dark focus:ring-0"
                                       placeholder="Enter your password"></input>
                                <label className="mt-2 inline-flex items-center">
                                    <input type="checkbox"
                                           onClick={onHidePassword}
                                           className="rounded bg-gray-200 border-transparent focus:border-transparent focus:bg-dark-mid text-gray-700 focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"/>
                                    <span className="ml-2">Show password</span>
                                </label>
                            </label>
                            <div className={"flex flex-col gap-3"}>
                                <button type="submit"
                                        className={"flex-center bg-green-dark w-1/4 p-3 rounded-full"}>Submit
                                </button>
                                <Link href={"/auth/register"}>
                                    <p className={"hover:underline"}>Not a member? <span className={"text-blue-400"}>Sign up</span>
                                    </p>
                                </Link>
                            </div>
                            <div className={`${errorMsg ? "p-2 px-6" : ""} bg-red-mid rounded-xl`}>
                                {errorMsg}
                            </div>
                            <div className={`${successMsg ? "p-2 px-6" : ""} bg-green-mid rounded-xl`}>
                                {successMsg}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </Layout>
    )
}
