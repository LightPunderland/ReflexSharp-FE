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
            return { 
                text: 'Noob', 
                color: '#B8860B'
            };
        case Rank.Pro:
            return { 
                text: 'Pro', 
                color: '#1E90FF'
            };
        case Rank.Master:
            return { 
                text: 'Master', 
                color: '#9400D3'
            };
        case Rank.God:
            return { 
                text: 'God', 
                color: '#3e3e79'
            };
        case Rank.Admin:
            return { 
                text: 'Admin', 
                color: '#DC143C'
            };
        default:
            return { 
                text: 'None', 
                color: '#ffffff' 
            };
    }
}