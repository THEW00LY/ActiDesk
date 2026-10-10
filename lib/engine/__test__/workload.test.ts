import { describe, it, expect } from "vitest";
import {
    calculateWeeklyWorkload,
    WorkloadProject,
    CapacityConfig,
} from "../workload";

describe("Workload & Capacity Engine", () => {
    const defaultConfig: CapacityConfig = {
        WeeklyCapacityHours: 35,
    };

    it("doit retourner un résultat vide si aucun projet n'est fourni", () => {
        const result = calculateWeeklyWorkload([], defaultConfig);
        expect(result.weeks).toHaveLength(0);
        expect(result.overallRiskScore).toBe(0);
        expect(result.hasOverload).toBe(false);
    });

    it("doit répartir uniformément les heures sur une seule semaine", () => {
        const projects: WorkloadProject[] = [
            {
                id: "p1",
                name: "Refonte Site Web",
                estimatedHours: 20,
                startDate: new Date ("2026-11-02"),
                endDate: new Date("2026-11-06"),
            },
        ];

        const result = calculateWeeklyWorkload(projects, defaultConfig);

        expect(result.weeks).toHaveLength(1);
        expect(result.weeks[0].totalHours).toBe(20);
        expect(result.weeks[0].utilizationRate).toBeCloseTo(20 / 35, 2);
        expect(result.weeks[0].isOverloaded).toBe(false);
        expect(result.hasOverload).toBe(false);
    });

    it("doit détecter une surréservation (saturation > 100%)", () => {
        const projects: WorkloadProject[] = [
            {
                id: "p1",
                name: "Mission A",
                estimatedHours: 25,
                startDate: new Date("2026-11-02"),
                endDate: new Date("2026-11-06"),
            },
            {
                id: "p2",
                name: "Mission B",
                estimatedHours: 20,
                startDate: new Date("2026-11-02"),
                endDate: new Date("2026-11-06"),
            },
        ];

        const result = calculateWeeklyWorkload(projects, defaultConfig);

        //test 20+25 = 45h sur une capacité de 35h
        expect(result.weeks[0].totalHours).toBe(45);
        expect(result.weeks[0].isOverloaded).toBe(true);
        expect(result.hasOverload).toBe(true);
        expect(result.overallRiskScore).toBeGreaterThan(0);
    });

    it("doit ventiler proportionnellement les heures sur plusieurs semaines", () => {
        const projects: WorkloadProject[] = [
            {
                id: "p1",
                name: "Audit d'architecture",
                estimatedHours: 40,
                startDate: new Date("2026-11-02"),
                endDate: new Date("2026-11-13"),
            },
        ];

        const result = calculateWeeklyWorkload(projects, defaultConfig);

        expect(result.weeks).toHaveLength(2);
        expect(result.weeks[0].totalHours).toBeCloseTo(20, 1);
        expect(result.weeks[1].totalHours).toBeCloseTo(20, 1);
        expect(result.hasOverload).toBe(false);
    });
});