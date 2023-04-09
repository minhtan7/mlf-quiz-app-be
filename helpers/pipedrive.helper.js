const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const createLeadPD = async ({ name, email, job }) => {
    try {
        const data = { name, email, job }
        const url = `https://medlangfanatic.pipedrive.com/v1/persons?api_token=${process.env.PIPEDRIVE_API}`
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...data, marketing_status: "subscribed" })
        });
        console.log(await res.json())
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createLeadPD }