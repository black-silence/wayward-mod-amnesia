var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "utilities/Random", "mod/Mod", "mod/IHookHost"], function (require, exports, Random_1, Mod_1, IHookHost_1) {
    "use strict";
    class Amnesia extends Mod_1.default {
        onInitialize(saveDataGlobal) {
        }
        onLoad(saveData) {
            if (saveData !== undefined) {
                this.lostRecipes = saveData;
                for (let r in this.lostRecipes) {
                    let craftedId = this.lostRecipes[r];
                    delete game.crafted[craftedId];
                }
                game.updateTablesAndWeight();
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
            let gen = new Random_1.SeededGenerator();
            let rdm = new Random_1.Random(gen);
            let chance = rdm.intInRange(25, 75) / 100;
            for (let i in game.crafted) {
                let f = rdm.float();
                if (f < chance) {
                    this.lostRecipes.push(Number(i));
                    delete game.crafted[i];
                }
            }
            game.updateTablesAndWeight();
        }
    }
    __decorate([
        IHookHost_1.HookMethod
    ], Amnesia.prototype, "onGameStart", null);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Amnesia;
});
