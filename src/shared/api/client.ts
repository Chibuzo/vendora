type CustomFetchOptions<TBody> = {
    url: string;
    method: string;
    body?: TBody;
}

export const customFetch = async <TResponse, TBody = unknown>({
    url,
    method,
    body
}: CustomFetchOptions<TBody>): Promise<TResponse> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
        throw await res.json()
    }

    return res.json() as Promise<TResponse>
}
