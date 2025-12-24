package com.onsen.domain;

public class WorldState {
    private int sanity;
    private Location currentLocation;
    private boolean noticedFin;
    private boolean bleeding;
    private boolean attackedVisitor;
    private int exposureLevel;
    private int loopCount;
    private EndingStatus ending;
    private boolean requiresStaffGuidance;

    public WorldState() {
        this.sanity = 100;
        this.currentLocation = Location.HOME;
        this.noticedFin = false;
        this.bleeding = false;
        this.attackedVisitor = false;
        this.exposureLevel = 0;
        this.loopCount = 0;
        this.ending = EndingStatus.NONE;
        this.requiresStaffGuidance = false;
    }

    public void decreaseSanity(int amount) {
        this.sanity = Math.max(0, this.sanity - amount);
    }
    
    public void increaseSanity(int amount) {
        this.sanity = Math.min(100, this.sanity + amount);
    }

    public void increaseExposure(int amount) {
        this.exposureLevel += amount;
    }
    
    public void decreaseExposure(int amount) {
        this.exposureLevel = Math.max(0, this.exposureLevel - amount);
    }

    public void markNoticedFin() {
        this.noticedFin = true;
    }
    
    public void markBleeding() {
        this.bleeding = true;
    }
    
    public void markAttackedVisitor() {
        this.attackedVisitor = true;
    }

    public void setEnding(EndingStatus ending) {
        this.ending = ending;
    }
    
    public void incrementLoopCount() {
        this.loopCount++;
    }
    
    public void setLocation(Location location) {
        this.currentLocation = location;
    }

    // Getters
    public int getSanity() {
        return sanity;
    }

    public Location getCurrentLocation() {
        return currentLocation;
    }
    
    public boolean isNoticedFin() {
        return noticedFin;
    }
    
    public boolean isBleeding() {
        return bleeding;
    }
    
    public boolean isAttackedVisitor() {
        return attackedVisitor;
    }

    public int getExposureLevel() {
        return exposureLevel;
    }
    
    public int getLoopCount() {
        return loopCount;
    }

    public EndingStatus getEnding() {
        return ending;
    }

    public boolean isRequiresStaffGuidance() {
        return requiresStaffGuidance;
    }

    public void setRequiresStaffGuidance(boolean requiresStaffGuidance) {
        this.requiresStaffGuidance = requiresStaffGuidance;
    }

    public void clearStaffGuidance() {
        this.requiresStaffGuidance = false;
    }
}
