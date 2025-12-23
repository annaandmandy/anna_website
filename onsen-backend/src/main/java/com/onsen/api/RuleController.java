package com.onsen.api;

import com.onsen.rule.RuleLoader;
import com.onsen.rule.RuleStage;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RuleController {
    private final RuleLoader ruleLoader = new RuleLoader();

    @GetMapping("/api/rules/current")
    public String getCurrentRules() {
        return ruleLoader.load(RuleStage.PAPER_1);
    }
}