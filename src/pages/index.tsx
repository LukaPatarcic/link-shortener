import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import {FormEvent} from "react";

const Home: NextPage = () => {
  const { mutateAsync, isLoading } = trpc.useMutation(["shorten"]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = new FormData(e.currentTarget)
      const url = form.get('url')?.toString();
      if(!url) return;
      mutateAsync({ url }).then(() => {}).catch((err) => {
          console.log(err.message);
      });
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="url" />
        <button type="submit">{isLoading ? 'Loading...' : 'Submit'}</button>
      </form>
    </div>
  );
};

export default Home;
