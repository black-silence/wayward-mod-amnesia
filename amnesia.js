var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Mod = (function (_super) {
    __extends(Mod, _super);
    function Mod() {
        _super.apply(this, arguments);
    }
    Mod.prototype.onInitialize = function (saveDataGlobal) {
    };
    Mod.prototype.onLoad = function (saveData) {
        if (saveData !== undefined) {
            this.lostRecipes = saveData;
            for (var r in this.lostRecipes) {
                var craftedId = this.lostRecipes[r];
                delete game.crafted[craftedId];
            }
            game.updateCraftTableAndWeight();
        }
        else {
            this.lostRecipes = [];
        }
    };
    Mod.prototype.onUnload = function () {
        for (var r in this.lostRecipes) {
            var craftedId = this.lostRecipes[r];
            game.crafted[craftedId] = true;
        }
    };
    Mod.prototype.onSave = function () {
        var cleanArray = [];
        for (var r in this.lostRecipes) {
            var craftedId = this.lostRecipes[r];
            if (game.crafted[craftedId] !== true) {
                cleanArray.push(craftedId);
            }
        }
        this.lostRecipes = cleanArray;
        return this.lostRecipes;
    };
    Mod.prototype.onGameStart = function (isLoadingSave, playedCount) {
        if (isLoadingSave) {
            return;
        }
        if (playedCount < 10) {
            return;
        }
        var chance = Utilities.Random.randomFromInterval(25, 75) / 100;
        for (var i in game.crafted) {
            var f = Utilities.Random.nextFloat();
            if (f < chance) {
                this.lostRecipes.push(Number(i));
                delete game.crafted[i];
            }
        }
        game.updateCraftTableAndWeight();
    };
    return Mod;
}(Mods.Mod));
