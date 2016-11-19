/// <reference path="mod-reference/modreference.d.ts"/>

export default class Mod extends Mods.Mod {

    private lostRecipes: number[];

    /**
     * Called when the mod is initialized (mod files are read/loaded when the title screen loads)
     * @param saveDataGlobal The save data object you previously saved via onInitialize()
     * @returns An object containing the data you want to save (saved globally, not per slot)
     */
    public onInitialize(saveDataGlobal: any): any {
    }
    /**
     * Called when the mod is loaded
     * Called before the world is loaded
     * @param saveData The save data object you previously saved via onSave()
     */
    public onLoad(saveData: any): void {
        if (saveData !== undefined) {
            // Remove recipes that are lost in this game slot
            this.lostRecipes = saveData;
            for (let r in this.lostRecipes) {
                let craftedId = this.lostRecipes[r];
                delete game.crafted[craftedId];
            }
            // Want to display the new craft table right from the start
            game.updateCraftTableAndWeight();
        } else {
            this.lostRecipes = [];
        }
    }
    /**
     * Called when the mod is unloaded (quit to main menu)
     * Called after onSave() when a game is ending
     */
    public onUnload(): void {
        // Restore all recipes that were deleted because the list is global and should not influence other game slots
        for (let r in this.lostRecipes) {
            let craftedId = this.lostRecipes[r];
            game.crafted[craftedId] = true;
        }
    }
    /**
     * Called when the game is saved or the mod is unloaded
     * This will be called before onUnload
     * @returns An object containing the data you want to save
     */
    public onSave(): any {
        // Save only recipes that were not rediscovered
        let cleanArray: number[] = [];
        for (let r in this.lostRecipes) {
            let craftedId = this.lostRecipes[r];
            if (game.crafted[craftedId] !== true) {
                cleanArray.push(craftedId);
            }
        }
        this.lostRecipes = cleanArray;
        return this.lostRecipes;
    }
    /**
     * Called when the game is starting
     * Called after onLoad()
     * @param isLoadingSave True if a save game was loaded
     * @param playedCount The number of times the player has played the game (globally, not per slot)
     */
    public onGameStart(isLoadingSave: boolean, playedCount: number): void {

        if (isLoadingSave) {
            return; // Restoring changed recipe list is handled in onLoad
        }

        // New game started, remove some recipes

        if (playedCount < 10) {
            return; // Don't want to kill new players' recipes
        }

        // 25% to 75% chance to lose any recipe
        let chance = Utilities.Random.randomFromInterval(25, 75) / 100;

        for (let i in game.crafted) {
            let f = Utilities.Random.nextFloat();
            if (f < chance) {
                this.lostRecipes.push(Number(i));
                delete game.crafted[i];
            }
        }

        // Want to display the new craft table right from the start.
        // This is only called once per loading game so it shouldn't hurt
        game.updateCraftTableAndWeight();

    }

}
