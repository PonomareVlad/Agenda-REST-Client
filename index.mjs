import {getURL} from "vercel-grammy";

export const {
    AGENDA_API_URL,
    AGENDA_API_KEY,
    AGENDA_RUN_PATH = "api/task/run",
    AGENDA_CALLBACK_PATH = "api/task/callback",
} = process.env;

export const agendaHeaders = (headers = {}) => ({
    "Content-Type": "application/json",
    "x-api-key": AGENDA_API_KEY,
    ...headers,
});

export const agendaURL = method => new URL(
    method,
    AGENDA_API_URL
);

export const fetchAgenda = (path, {
    body,
    method,
    headers = {},
} = {}) => fetch(agendaURL(path), {
    headers: agendaHeaders(headers),
    body: JSON.stringify(body),
    method,
}).then(async response => {
    const result = await response.text();
    if (!response.ok) throw result;
    return result;
});

export async function createAgendaJob(name, runPath = AGENDA_RUN_PATH, callbackPath = AGENDA_CALLBACK_PATH) {
    const body = {
        name,
        url: getURL({
            path: runPath
        }),
        callback: {
            url: getURL({
                path: callbackPath
            }),
        }
    }
    try {
        return await fetchAgenda(`job/${name}`, {body, method: "PUT"});
    } catch {
        return await fetchAgenda("job", {body, method: "POST"});
    }
}
