export interface WorkloadProject {
    id: string;
    name: string;
    estimatedHours: number;
    startDate: Date;
    endDate: Date;
}

export interface CapacityConfig {
    weeklyCapacityHours: number;
}

export interface WeeklyBucket {
  weekKey: string;
  startDate: Date;
  totalHours: number;
  utilizationRate: number;
  isOverloaded: boolean;
  projectAllocations: ProjectAllocation[];
}

export interface WorkloadAnalysis {
  weeks: WeeklyBucket[];
  hasOverload: boolean;
  overallRiskScore: number;
}

//interface pr la map
export interface ProjectAllocation {
    projectId: string;
    projectName: string;
    hours: number;
}

export interface MondayTracker {
    monday: Date;
    allocations: ProjectAllocation[];
}

function isWorkingDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6; // Ni dimanche (0) ni samedi (6)
}

export function calculateWeeklyWorkload (
    projects: WorkloadProject[], config: CapacityConfig
) : WorkloadAnalysis {
    let bucketMap = new Map<string, MondayTracker>();

    
    if (projects.length === 0) {
        return { weeks: [], hasOverload: false, overallRiskScore: 0};
    }
    
    for (const project of projects) {
        const start = new Date(project.startDate);
        const end = new Date(project.endDate);
        
        const durationDays = Math.max(
            1,
            Math.ceil( (end.getTime() - start.getTime()) / (1000*60*60*24)) + 1
        );
        
        let workingDaysCount = 0;
        let counter = new Date(start);
        while (counter <= end) {
        if (isWorkingDay(counter)) {
            workingDaysCount++;
        }
        counter.setDate(counter.getDate() + 1);
        }
        workingDaysCount = Math.max(1, workingDaysCount);

        const dailyHours = project.estimatedHours / workingDaysCount;
        
        let current = new Date(start);
        while (current <= end) {
            if (isWorkingDay(current)) {
                const weekStart = getStartOfWeek(current);
                const weekKey = formatWeekKey(weekStart);

                if (!bucketMap.has(weekKey)) {
                    bucketMap.set(weekKey, { monday: weekStart, allocations: [] });
                }
                const bucket = bucketMap.get(weekKey)!;
                const existing = bucket.allocations.find((a) => a.projectId === project.id);

                if (existing) {
                    existing.hours += dailyHours;
                } else {
                    bucket.allocations.push({
                        projectId: project.id,
                        projectName: project.name,
                        hours: dailyHours,
                    });
                }
            }

            current.setDate(current.getDate() + 1);
        }
    }
    
    const sortedKeys = Array.from(bucketMap.keys()).sort();
    
    let maxOverloadRatio = 0;
    let hasAnyOverload = false;

    const weeks = sortedKeys.map((key) => {
        const item = bucketMap.get(key)!;

        //total h semaine
        const totalHours = item.allocations.reduce((sum, alloc) => sum + alloc.hours, 0);

        //taux d'utilisation sur 35h supposé
        const utilizationRate = totalHours / config.weeklyCapacityHours;

        //surcharge si on dépasse le seuil du config
        const isOverloaded= totalHours > config.weeklyCapacityHours;

        if (isOverloaded) {
            hasAnyOverload = true;
            const overloadRatio = (totalHours - config.weeklyCapacityHours) / config.weeklyCapacityHours
            if (overloadRatio > maxOverloadRatio) {
                maxOverloadRatio = overloadRatio;
            }
        }

        return {
            weekKey: key,
            startDate: item.monday,
            totalHours,
            utilizationRate,
            isOverloaded,
            projectAllocations: item.allocations,
        };
    });

    const overallRiskScore = hasAnyOverload
        ? Math.min(100, Math.round(maxOverloadRatio * 100))
        : 0;
    
    return {
        weeks,
        hasOverload: hasAnyOverload,
        overallRiskScore,
    };
}

//norme anglosaxonne, dimanche == 0
export function getStartOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - (day === 0 ? 6 : day - 1);
    //get-time donne une date exploitable mathématiquement
    //utiliser set-date pour la réinjecter comme date
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
} 

export function formatWeekKey(date: Date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const firstJan = new Date(year, 0, 1);

    const diff = d.getTime() - firstJan.getTime();
    const dayPassed = Math.floor(diff / (1000 * 60 * 60 * 24));

    const weekNumber = Math.ceil( (dayPassed + firstJan.getDay() + 1 ) / 7);
    return `${year}-W${String(weekNumber).padStart(2, "0")}`;
}

