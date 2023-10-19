import React from "react";
import {GetServerSidePropsContext} from "next";
import {getSession, signOut, useSession} from "next-auth/react";
import {Button} from "../shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcn/components/ui/card";
import {TOKEN_EXPIRES_IN} from "../config";

export default function Dashboard() {
  const {data: session} = useSession();

  return (
    <div className="w-full m-auto bg-whitelg:max-w-lg">
      <Card className="bg-slate-300 w-1/2 ml-auto mr-auto mt-20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Dashboard Page
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full justify-center">
          <p className="text-xl text-center">Welcome {session?.user?.name}</p>
          <p className="text-lg text-center">Today is {new Date(Date.now()).toLocaleString()}</p>
          <p className="text-lg text-center">
            The token expires after {TOKEN_EXPIRES_IN} seconds
          </p>
        </CardContent>
        <CardFooter className="flex flex-col mt-12">
          <Button onClick={() => signOut()}>Sign Out</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession({req: context.req});

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permananet: false,
      },
    };
  }

  return {
    props: {session},
  };
};
