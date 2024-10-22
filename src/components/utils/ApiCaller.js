let baseUrl = process.env.REACT_APP_BASEURL

export const ApiCaller = async (body, headers, endPoint) => {
    let url = baseUrl + endPoint
    const response = await fetch(url, {
        method: "POST",
        body: body,
        headers: headers,
    })
    const res = await response.json();
    return res
}