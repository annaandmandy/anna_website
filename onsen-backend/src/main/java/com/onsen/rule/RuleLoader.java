package com.onsen.rule;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class RuleLoader {

    private static final String RULE_BASE_PATH = "rules";

    public String load(RuleStage stage) {
        String folder;

        if (stage == RuleStage.PAPER_1) {
            folder = "paper1";
        } else if (stage == RuleStage.PAPER_2) {
            folder = "paper2";
        } else if (stage == RuleStage.PAPER_3) {
            folder = "paper3";
        } else if (stage == RuleStage.PAPER_4) {
            folder = "paper4";
        } else {
            throw new IllegalArgumentException("Unknown rule stage: " + stage);
        }

        Path path = Path.of(RULE_BASE_PATH, folder, "rules.md");

        try {
            return Files.readString(path);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load rules for " + stage, e);
        }
    }
}