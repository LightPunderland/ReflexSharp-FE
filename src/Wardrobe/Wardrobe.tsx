import React from 'react';
import * as PIXI from "pixi.js";
import styles from "./Wardrobe.module.css"; // Styling file for the wardrobe page
import { GetUser } from '../Profile/GetUser';
import { useEffect, useState } from "react";
import axios from "axios";
import { SpriteCache } from "../Play/utility/spriteCache";

import { rewardGoldXp } from "../Play/PostScore";



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
    const [userRank, setUserRank] = useState(0);
    const [ownedSkins, setOwnedSkins] = useState(["Default"]);
    const [equippedSkin, setEquippedSkin] = useState("Default"); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                
                const userData = await GetUser(userId);
                console.log("come on user data", userData);
                console.log("This is the gold", userData.equippedSkin.charAt(0).toUpperCase() + userData.equippedSkin.slice(1));
                if(userData.equippedSkin === "ninja"){
                    SpriteCache.skin = userData.equippedSkin;
                }
                else{
                    const skin = userData.equippedSkin.charAt(0).toUpperCase() + userData.equippedSkin.slice(1);
                    SpriteCache.skin = skin;
                }
                
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchUserData();
    }, [userId]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await GetUser(userId);
                setUserGold(userData.gold);
                setUserRank(userData.publicRank);
                setOwnedSkins(userData.ownedSkins);
                setLoading(false);
            } catch (err) {
                setError("Failed to load user data.");
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);


    // Sample list of skins
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
        { id: 15, name: "angry", image: angry, gold: 150, rank: 1    },
        { id: 16, name: "ninja", image: ninja, gold: 0, rank: 0   }
    ];

    const [selectedSkin, setSelectedSkin] = useState<{ id: number; name: string; image: string; gold: number; rank: number } | null>(null);

    // Handle selecting a skin
    const handleSelectSkin = (skin: { id: number; name: string; image: string; gold: number; rank: number }) => {
        setSelectedSkin(skin);
    };

    // Handle buying a skin
    const handleBuySkin = () => {
        if (
            selectedSkin &&
            userGold >= selectedSkin.gold &&
            userRank >= selectedSkin.rank
        ) {
            setOwnedSkins([...ownedSkins, selectedSkin.name]);
            rewardGoldXp(userId, -(selectedSkin.gold), 0).catch(e => {
                                        console.error('Error rewarding gold and xp: ', e);
                                    });

            
            addSkinToUser(userId, selectedSkin.name);

            setUserGold(userGold - selectedSkin.gold);
        }
    };


    const handleEquipSkin = async () => {
        if (selectedSkin && ownedSkins.includes(selectedSkin.name)) {
            setEquippedSkin(selectedSkin.name);
            try {
                await equipSkin(userId, selectedSkin.name); 
                window.location.reload();
            } catch (error) {
                console.error("Error equipping skin:", error);
            }
        }

        

    };

    return (
        <div className={styles.container}>
    <p className={styles.userStats}>
        Gold: {userGold} | Rank: {userRank}
    </p>
    {/* Action Buttons */}
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

    {/* Scrollable Grid */}
    <div className={styles.scrollableGrid}>
        <div className={styles.grid}>
            {skins.map((skin) => (
                <div
                    key={skin.id}
                    className={`${styles.skinBox} ${
                        selectedSkin?.id === skin.id ? styles.selected : ""
                    }`}
                    onClick={() => handleSelectSkin(skin)}
                >
                    <img
                        src={skin.image}
                        alt={skin.name}
                        className={styles.skinImage}
                    />
                    <p className={styles.skinName}>{skin.name}</p>
                    <p className={styles.skinDetails}>
                        Gold: {skin.gold} | Rank: {skin.rank}
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

