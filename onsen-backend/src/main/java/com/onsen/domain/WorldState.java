package com.onsen.domain;

import java.util.HashSet;
import java.util.Set;

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
    private boolean justGotInjured;
    private boolean shouldAttackVisitor;
    private Set<Location> visitedLocations;

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
        this.justGotInjured = false;
        this.shouldAttackVisitor = false;
        this.visitedLocations = new HashSet<>();
        this.visitedLocations.add(Location.HOME); // Start at home
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
        this.visitedLocations.add(location); // Track visited location
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

    public boolean isJustGotInjured() {
        return justGotInjured;
    }

    public void setJustGotInjured(boolean justGotInjured) {
        this.justGotInjured = justGotInjured;
    }

    public void clearInjuredFlag() {
        this.justGotInjured = false;
    }

    public boolean isShouldAttackVisitor() {
        return shouldAttackVisitor;
    }

    public void setShouldAttackVisitor(boolean shouldAttackVisitor) {
        this.shouldAttackVisitor = shouldAttackVisitor;
    }

    public void clearAttackFlag() {
        this.shouldAttackVisitor = false;
    }

    public boolean hasVisited(Location location) {
        return visitedLocations.contains(location);
    }

    public Set<Location> getVisitedLocations() {
        return new HashSet<>(visitedLocations);
    }
}
