import React, { useState } from "react";
import styles from "./Wardrobe.module.css"; // Styling file for the wardrobe page
import skin1 from "../assets/login.png"; // Import skins
import skin2 from "../assets/leaderboard.png";
import skin3 from "../assets/logout-hover.png";

function Wardrobe() {
    // Sample user data (these could come from props or an API in the future)
    const [userGold, setUserGold] = useState(1500);
    const [userRank, setUserRank] = useState(10);
    const [ownedSkins, setOwnedSkins] = useState(["Default"]); // List of skins owned
    const [equippedSkin, setEquippedSkin] = useState("Default"); // Currently equipped skin

    // Sample list of skins
    const skins = [
        { id: 1, name: "Knight", image: skin1, gold: 500, rank: 5 },
        { id: 2, name: "Samurai", image: skin2, gold: 1000, rank: 8 },
        { id: 3, name: "Ninja", image: skin3, gold: 2000, rank: 12 },
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
            setUserGold(userGold - selectedSkin.gold);
        }
    };

    // Handle equipping a skin
    const handleEquipSkin = () => {
        if (selectedSkin && ownedSkins.includes(selectedSkin.name)) {
            setEquippedSkin(selectedSkin.name);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Wardrobe</h1>
            <p className={styles.userStats}>
                Gold: {userGold} | Rank: {userRank}
            </p>

            {/* Skins Grid */}
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
        </div>
    );
}

export default Wardrobe;
