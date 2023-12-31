import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Form from "../components/form";

const Dashboard: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Sign In | Create an Account</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Form />
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permananet: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default Dashboard;
