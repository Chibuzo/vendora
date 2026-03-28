export const customFetch = async ({ url, method, body }: { url: string, method: string, body: any }) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) throw await res.json()

    return res.json()
}