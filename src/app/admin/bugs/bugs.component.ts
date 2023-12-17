import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgChartsModule} from "ng2-charts";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Bug} from "../../bug-report/bug-report.component";
import {AdminService} from "../admin.service";

@Component({
    selector: 'app-bugs',
    standalone: true,
    imports: [CommonModule, NgChartsModule, ReactiveFormsModule, FormsModule],
    templateUrl: './bugs.component.html',
    styleUrl: './bugs.component.css'
})
export class BugsComponent {
    lineChartData: any[] = [{data: [], label: 'Bug Reports'}];
    lineChartLabels: string[] = [];
    sortedLineChartLabels: string[] = [];
    lineChartOptions: any = {
        responsive: true,
        scale: {
            ticks: {
                precision: 0
            },
        },
    };
    bugs: any;

    selectedTopic: string = 'All';

    constructor(
        private adminService: AdminService,
        private cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.adminService.getBugReports().subscribe((bugs) => {
            console.log(bugs)
            this.bugs = bugs
            this.lineChartData[0].data = this.getDataArray(bugs);
            this.lineChartLabels = this.getLabelArray(bugs);
            this.sortedLineChartLabels = [...this.lineChartLabels]
                .sort((a, b) =>
                    new Date(a).getTime() - new Date(b).getTime());
            this.cd.detectChanges()
        });
    }

    private getDataArray(bugs: Bug[]): number[] {
        const groupedData = this.groupDataByDay(bugs);
        return Object.values(groupedData).map((count) => count.length);
    }

    private getLabelArray(bugs: Bug[]): string[] {
        const groupedData = this.groupDataByDay(bugs);
        return Object.keys(groupedData);
    }

    private groupDataByDay(bugs: Bug[]): { [key: string]: Bug[] } {
        const groupedData: { [key: string]: Bug[] } = {};
        bugs.forEach((bug) => {
            const dateKey = this.formatDate(bug.timestamp);
            if (!groupedData[dateKey]) {
                groupedData[dateKey] = [];
            }
            groupedData[dateKey].push(bug);
        });
        return groupedData;
    }

    formatDate(timestamp: any): string {
        const date = timestamp.toDate(); // Convert Timestamp to Date
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }


    filteredBugs(): { topic: string, timestamp: Date, customText: string }[] {
        if (this.selectedTopic === 'All') {
            return this.bugs;
        } else {
            return this.bugs.filter((bug: any) => bug.topic === this.selectedTopic);
        }
    }

    formatDateInMeta(timestamp: any): string {
        return timestamp.toDate();
    }
}
