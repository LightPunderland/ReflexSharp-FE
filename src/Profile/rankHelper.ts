export enum Rank {
    None = 0,
    Noob = 1,
    Pro = 2,
    Master = 3,
    God = 4,
    Admin = 5
}

interface RankStyle {
    text: string;
    color: string;
}

export function getRankStyle(rank: Rank): RankStyle {
    switch (rank) {
        case Rank.Noob:
            return { text: 'Noob', color: '#8B4513' };
        case Rank.Pro:
            return { text: 'Pro', color: '#C0C0C0' };
        case Rank.Master:
            return { text: 'Master', color: '#FFD700' };
        case Rank.God:
            return { text: 'God', color: '#663399' };
        case Rank.Admin:
            return { text: 'Admin', color: '#DC143C' };
        default:
            return { text: 'None', color: '#ffffff' };
    }
}