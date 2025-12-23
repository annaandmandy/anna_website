package com.onsen.rule;

import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

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

        String resourcePath = RULE_BASE_PATH + "/" + folder + "/rules.md";
        ClassPathResource resource = new ClassPathResource(resourcePath);

        try {
            return resource.getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load rules for " + stage + " from " + resourcePath, e);
        }
    }
}