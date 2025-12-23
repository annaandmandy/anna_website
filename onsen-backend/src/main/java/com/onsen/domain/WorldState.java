package com.onsen.domain;

public class WorldState {
    private int sanity;
    private boolean injured;
    private int exposureLevel;
    private EndingStatus ending;
    
    public WorldState() {
        this.sanity = 100;
        this.injured = false;
        this.exposureLevel = 0;
        this.ending = EndingStatus.NONE;
    }

    public void decreaseSanity(int amount) {
        this.sanity = Math.max(0, this.sanity - amount);
    }

    public void increaseExposure(int amount) {
        this.exposureLevel += amount;
    }

    public void markInjured() {
        this.injured = true;
    }

    public void setEnding(EndingStatus ending) {
        this.ending = ending;
    }

    public int getSanity() {
        return sanity;
    }

    public boolean isInjured() {
        return injured;
    }

    public int getExposureLevel() {
        return exposureLevel;
    }

    public EndingStatus getEnding() {
        return ending;
    }
}
