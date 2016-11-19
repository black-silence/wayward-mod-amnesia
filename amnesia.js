define(["require", "exports"], function (require, exports) {
    "use strict";
    class Mod extends Mods.Mod {
        onInitialize(saveDataGlobal) {
        }
        onLoad(saveData) {
            if (saveData !== undefined) {
                this.lostRecipes = saveData;
                for (let r in this.lostRecipes) {
                    let craftedId = this.lostRecipes[r];
                    delete game.crafted[craftedId];
                }
                game.updateCraftTableAndWeight();
            }
            else {
                this.lostRecipes = [];
            }
        }
        onUnload() {
            for (let r in this.lostRecipes) {
                let craftedId = this.lostRecipes[r];
                game.crafted[craftedId] = true;
            }
        }
        onSave() {
            let cleanArray = [];
            for (let r in this.lostRecipes) {
                let craftedId = this.lostRecipes[r];
                if (game.crafted[craftedId] !== true) {
                    cleanArray.push(craftedId);
                }
            }
            this.lostRecipes = cleanArray;
            return this.lostRecipes;
        }
        onGameStart(isLoadingSave, playedCount) {
            if (isLoadingSave) {
                return;
            }
            if (playedCount < 10) {
                return;
            }
            let chance = Utilities.Random.randomFromInterval(25, 75) / 100;
            for (let i in game.crafted) {
                let f = Utilities.Random.nextFloat();
                if (f < chance) {
                    this.lostRecipes.push(Number(i));
                    delete game.crafted[i];
                }
            }
            game.updateCraftTableAndWeight();
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Mod;
});
