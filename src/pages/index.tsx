import { FormEvent, useState } from 'react';

import type { NextPage } from 'next';

import clsx from 'clsx';
import { z } from 'zod';

import { trpc } from '@util/trpc';

const schema = z.string().url().nullable();
const Home: NextPage = () => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const {
        mutate,
        isLoading,
        data: slug,
        isError,
    } = trpc.useMutation(['shorten']);
    const slugLink = slug ? `${window.location.origin}/${slug}` : '';

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = schema.safeParse(url);
        if (!result.success) return;
        mutate({ url });
    };

    const onChange = (value: string) => {
        const result = schema.safeParse(value);
        if (!result.success) {
            setError(result?.error?.errors?.[0]?.message ?? '');
        } else {
            setError('');
        }

        setUrl(value);
    };

    const onCopy = () => {
        navigator.clipboard.writeText(slugLink).then(() => {
            setShowTooltip(true);
            const timeout = setTimeout(() => {
                setShowTooltip(false);
            }, 1500);

            if (showTooltip) {
                clearTimeout(timeout);
            }
        });
    };

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <form onSubmit={onSubmit} className="w-full max-w-sm">
                    <h1 className="mb-3 text-3xl font-bold">
                        Copy a link and shorten it
                    </h1>
                    <div className="mb-4">
                        <input
                            className={clsx(
                                'w-full',
                                'appearance-none',
                                'border-2',
                                'rounded',
                                'w-full',
                                'py-2',
                                'px-4',
                                'text-gray-700',
                                'focus:outline-none',
                                'focus:bg-white',
                                'focus:border-blue-500',
                                {
                                    'border-red-400': error,
                                }
                            )}
                            id="inline-full-name"
                            type="text"
                            name="url"
                            value={url}
                            placeholder="Paste your link here..."
                            onChange={(e) => onChange(e.target.value)}
                        />
                        {error && <span className="text-red-400">{error}</span>}
                    </div>
                    {slug && (
                        <>
                            <div
                                className="mb-2 underline text-center cursor-pointer relative"
                                onClick={onCopy}
                            >
                                {slugLink}
                                {showTooltip && (
                                    <div
                                        role="tooltip"
                                        className="absolute z-10 py-2 px-3 text-sm font-medium text-white rounded-lg shadow-sm tooltip dark:bg-gray-700 text-center -right-7 top-1/2 -translate-y-1/2 z-10"
                                    >
                                        Copied
                                        <div className="tooltip-arrow w-2 h-2 dark:bg-gray-700 absolute -left-0.5 top-1/2 -translate-y-1/2 rotate-45 z-0" />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {isError && (
                        <div
                            className="p-4 mb-4 text-sm text-red-900 bg-red-100 border border-red-900 rounded-lg"
                            role="alert"
                        >
                            <span className="font-medium">
                                Something went wrong...
                            </span>{' '}
                            Please try again later!
                        </div>
                    )}
                    <button
                        disabled={!!error || isLoading}
                        className="disabled:opacity-75 disabled:hover:bg-blue-500 disabled:cursor-not-allowed w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        type="submit"
                    >
                        {isLoading ? 'Loading...' : 'Shorten'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Home;
