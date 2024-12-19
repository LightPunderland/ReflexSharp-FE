import React from 'react';
import * as PIXI from "pixi.js";
import styles from "./Wardrobe.module.css";
import { GetUser } from '../Profile/GetUser';
import { useEffect, useState } from "react";
import axios from "axios";
import { SpriteCache } from "../Play/utility/spriteCache";
import { rewardGoldXp } from "../Play/PostScore";
import { Rank, getRankStyle } from '../Profile/rankHelper';

interface WardrobeProps {
    userId: string;
}

async function addSkinToUser(userId: string, skinName: string): Promise<void> {
    try {
        const response = await axios.post(`/api/users/${userId}/skins/${skinName}`);
        console.log("Skin added successfully:", response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error adding skin to user:", error.response?.data || error.message);
        } else {
            console.error("Error adding skin to user:", error);
        }
    }
}

async function equipSkin(userId: string, skinName: string): Promise<void> {
    try {
        const response = await axios.post(`/api/users/${userId}/equip/${skinName}`);
        console.log("Skin equipped successfully:", response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error equipping skin:", error.response?.data || error.message);
        } else {
            console.error("Error equipping skin:", error);
        }
    }
}

interface WardrobeItemDTO {
    id: string;
    name: string;
    price: number;
    rankRequirement: number;
}

const getSpecialSkinName = (skinName: string, defaultName: string) => {
    const specialSkins = ['angry', 'camo', 'not', 'underwater', 'flipped', 'rich'];
    if (specialSkins.includes(skinName.toLowerCase())) {
        return (
            <p 
                className={styles.skinName} 
                data-skin={skinName.toLowerCase()}
                data-content={defaultName} // Added for camo effect
            >
                {defaultName}
            </p>
        );
    }
    return <p className={styles.skinName}>{defaultName}</p>;
};

async function getWardrobeItemByName(name: string): Promise<WardrobeItemDTO | null> {
    try {
        const response = await axios.get(`/api/wardrobe/name/${name}`);
        console.log("Wardrobe item fetched:", response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching wardrobe item:", error.response?.data || error.message);
        } else {
            console.error("Error fetching wardrobe item:", error);
        }
        return null;
    }
}

function Wardrobe({ userId }: WardrobeProps) {

    // Sprites D:
    const flipped = 'api/sprite/by-name/Flipped';
    const not = 'api/sprite/by-name/Not';
    const underwater = 'api/sprite/by-name/Underwater';
    const camo = 'api/sprite/by-name/Camo';
    const rich = 'api/sprite/by-name/Rich';
    const magenta = 'api/sprite/by-name/Magenta';
    const pink = 'api/sprite/by-name/Pink';
    const purple = 'api/sprite/by-name/Purple';
    const blue = 'api/sprite/by-name/Blue';
    const cyan = 'api/sprite/by-name/Cyan';
    const green = 'api/sprite/by-name/Green';
    const lime = 'api/sprite/by-name/Lime';
    const yellow = 'api/sprite/by-name/Yellow';
    const orange = 'api/sprite/by-name/Orange';
    const angry = 'api/sprite/by-name/Angry';
    const ninja = 'api/sprite/by-name/ninja';

    const [userGold, setUserGold] = useState(0);
    const [userRank, setUserRank] = useState<Rank>(Rank.None);
    const [ownedSkins, setOwnedSkins] = useState(["Default"]);
    const [equippedSkin, setEquippedSkin] = useState("Default");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getPriceCategory = (price: number): string => {
        if (price < 50) return "cheap";
        if (price < 100) return "common";
        if (price < 250) return "rare";
        if (price < 500) return "epic";
        return "legendary";
    };

    const capitalize = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };


useEffect(() => {
    const fetchUserData = async () => {
        try {
            const userData = await GetUser(userId);
            
            setUserGold(userData.gold);

            const rankNumber = Number(userData.publicRank);
            
            setUserRank(rankNumber);
            setOwnedSkins(userData.ownedSkins.map(skin => skin.toLowerCase()));
            const equippedSkinName = userData.equippedSkin.toLowerCase();
            setEquippedSkin(equippedSkinName);
            
            if (equippedSkinName === "ninja") {
                SpriteCache.skin = equippedSkinName;
            } else {
                SpriteCache.skin = capitalize(equippedSkinName);
            }
            
            setLoading(false);
        } catch (err) {
            setError("Failed to load user data.");
            setLoading(false);
        }
    };

    fetchUserData();
}, [userId]);

// 0 - none
// 1 noob 
// 2- pro 
// 3 master
// 4 god
// 5 admin (should never be used)

    const skins = [
        { id: 1, name: "flipped", image: flipped, gold: 750, rank: 1 }, 
        { id: 2, name: "not", image: not, gold: 300, rank: 2 }, 
        { id: 3, name: "underwater", image: underwater, gold: 500, rank: 3 }, 
        { id: 4, name: "camo", image: camo, gold: 250, rank: 3 }, 
        { id: 5, name: "rich", image: rich, gold: 1000, rank: 4 }, 
        { id: 6, name: "magenta", image: magenta, gold: 20, rank: 0 }, 
        { id: 7, name: "pink", image: pink, gold: 30, rank: 0 },
        { id: 8, name: "purple", image: purple, gold: 40, rank: 0 },
        { id: 9, name: "blue", image: blue, gold: 50, rank: 0 },
        { id: 10, name: "cyan", image: cyan, gold: 60, rank: 0 },
        { id: 11, name: "green", image: green, gold: 70, rank: 0 },
        { id: 12, name: "lime", image: lime, gold: 80, rank: 0 },
        { id: 13, name: "yellow", image: yellow, gold: 90, rank: 0 },
        { id: 14, name: "orange", image: orange, gold: 100, rank: 0 },
        { id: 15, name: "angry", image: angry, gold: 150, rank: 1 },
        { id: 16, name: "ninja", image: ninja, gold: 0, rank: 0 }
    ].sort((a, b) => a.gold - b.gold);

    const [selectedSkin, setSelectedSkin] = useState<typeof skins[0] | null>(null);

    const getSkinBoxClassName = (skin: typeof skins[0]): string => {
        const classes = [styles.skinBox];
        
        if (userRank < skin.rank) {
            classes.push(styles.rankLocked);
        } else if (!ownedSkins.includes(skin.name) && userGold < skin.gold) {
            classes.push(styles.goldLocked);
        } else if (ownedSkins.includes(skin.name)) {
            classes.push(styles.owned);
        }
        
        if (equippedSkin === skin.name) {
            classes.push(styles.equipped);
        }
        
        if (selectedSkin?.id === skin.id) {
            classes.push(styles.selected);
        }
        
        return classes.join(' ');
    };

    const handleSelectSkin = (skin: typeof skins[0]) => {
        setSelectedSkin(skin);
    };

    const handleBuySkin = async () => {
        if (
            selectedSkin &&
            userGold >= selectedSkin.gold &&
            userRank >= selectedSkin.rank &&
            !ownedSkins.includes(selectedSkin.name)
        ) {
            try {
                await addSkinToUser(userId, selectedSkin.name);
                await rewardGoldXp(userId, -selectedSkin.gold, 0);
                
                setOwnedSkins([...ownedSkins, selectedSkin.name]);
                setUserGold(userGold - selectedSkin.gold);
            } catch (error) {
                console.error("Error during purchase:", error);
            }
        }
    };

    const handleEquipSkin = async () => {
        if (selectedSkin && ownedSkins.includes(selectedSkin.name)) {
            try {
                await equipSkin(userId, selectedSkin.name);
                setEquippedSkin(selectedSkin.name);
                window.location.reload();
            } catch (error) {
                console.error("Error equipping skin:", error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <p className={styles.userStats}>
                <span className={styles.goldText}>Gold: {userGold}</span>
                <span className={styles.rankText} style={{ color: getRankStyle(userRank).color }}>
                    Rank: {getRankStyle(userRank).text}
                </span>
            </p>

            <div className={styles.actions}>
                <button
                    className={
                        selectedSkin &&
                        !ownedSkins.includes(selectedSkin.name) &&
                        userGold >= selectedSkin.gold &&
                        userRank >= selectedSkin.rank
                            ? styles.buyButton
                            : styles.buyButtonDisabled
                    }
                    onClick={handleBuySkin}
                    disabled={
                        !selectedSkin ||
                        ownedSkins.includes(selectedSkin.name) ||
                        userGold < selectedSkin.gold ||
                        userRank < selectedSkin.rank
                    }
                >
                    Buy
                </button>
                <button
                    className={
                        selectedSkin && ownedSkins.includes(selectedSkin.name)
                            ? styles.equipButton
                            : styles.equipButtonDisabled
                    }
                    onClick={handleEquipSkin}
                    disabled={
                        !selectedSkin || !ownedSkins.includes(selectedSkin.name)
                    }
                >
                    Equip
                </button>
            </div>

            <div className={styles.scrollableGrid}>
                <div className={styles.grid}>

                {skins.map((skin) => (
    <div
        key={skin.id}
        className={getSkinBoxClassName(skin)}
        data-price={getPriceCategory(skin.gold)}
        onClick={() => {
            if (userRank >= skin.rank) {
                handleSelectSkin(skin);
            }
        }}
    >
        <img
            src={skin.image}
            alt={capitalize(skin.name)}
            className={styles.skinImage}
        />
        {getSpecialSkinName(skin.name, capitalize(skin.name))}
        <p className={styles.skinDetails}>
            <span className={styles.goldText}>Gold: {skin.gold}</span> | 
            <span style={{ color: getRankStyle(skin.rank).color }}>
                Rank: {getRankStyle(skin.rank).text}
            </span>
        </p>
        {equippedSkin === skin.name && (
            <div className={styles.equippedIndicator}>✔ Equipped</div>
        )}
    </div>
))}
                </div>
            </div>
        </div>
    );
}

export default Wardrobe;