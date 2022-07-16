import type {NextPage} from "next";
import ReactTooltip from 'react-tooltip';
import {trpc} from "../utils/trpc";
import {FormEvent, useState} from "react";
import {z} from "zod";

const schema = z.string().url();
const Home: NextPage = () => {
	const [slug, setSlug] = useState('');
	const [url, setUrl] = useState('');
	const [error, setError] = useState('');
	const [showTooltip, setShowTooltip] = useState(false);
	const {mutateAsync, isLoading} = trpc.useMutation(["shorten"]);

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const result = schema.safeParse(url);
		if (!result.success) return;
		mutateAsync({url}).then((slug) => {
			setSlug(slug);
		}).catch((err) => {
			console.log(err.message);
		});
	}

	const onChange = (value: string) => {
		const result = schema.safeParse(value);
		if (!result.success) {
			setError(result.error.message);
		} else {
			setError('');
		}

		setUrl(value);
	}

	const onCopy = () => {
		navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
		setShowTooltip(true);
		const timeout = setTimeout(() => {
			setShowTooltip(false)
		}, 1000)

		if(showTooltip) {
			clearTimeout(timeout);
		}
	}

	return (
		<>
			<div className="flex justify-center items-center h-screen">
				<form onSubmit={onSubmit} className="w-full max-w-sm">
					<h1 className="mb-3 text-3xl font-bold">Copy a link and shorten it</h1>
					<input
						className="w-full mb-4 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
						id="inline-full-name" type="text" name="url" value={url}
						placeholder="Paste your link here..."
						onChange={(e) => onChange(e.target.value)}/>
					{slug &&
						<>
						<div className="mb-2 underline text-center cursor-pointer" onClick={onCopy}>
							{slug ? `${window.location.origin}/${slug}` : ''}
						</div>
						{showTooltip && <div className="text-green-600 text-center">Copied</div>}
                        </>}
					<button disabled={!!error || isLoading}
							className="disabled:opacity-75 disabled:hover:bg-blue-500 disabled:cursor-not-allowed w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							type="submit">{isLoading ? 'Loading...' : 'Shorten'}</button>
				</form>
			</div>
		</>
	);
};

export default Home;
