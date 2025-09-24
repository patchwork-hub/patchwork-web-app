export type Hashtag = {
    id: string;
    name: string;
    url: string;
    history: History[];
    following: boolean;
}

export type History = {
    day: string;
    uses: string;
    accounts: string;
}