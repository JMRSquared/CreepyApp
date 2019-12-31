/// <reference path="../node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="../node_modules/tns-platform-declarations/android-26.d.ts" />

import Vue, { ComponentOptions } from "vue";
declare module "vue/types/vue" {
    interface Vue {
        currentPage: number;
        $navigator: any;
        $firebase: any;
        navigate: any;
        victims: any[];
        showSnackBar: any;
    }
}

declare module android {
    module app {
        export module job {
            export class JobService {
                public static extend(name: string, jobservice: {
                    onStartJob(params: android.app.job.JobParameters): boolean,
                    onStopJob(params: android.app.job.JobParameters): boolean,
                    jobFinished?(params: android.app.job.JobParameters, wantsReschedule: boolean)
                })
            }
            export class JobParameters {
                public getExtras(): android.os.PersistableBundle;
            }
        }
    }
    module os {
        export class PersistableBundle extends java.lang.Object implements android.os.IParcelable, java.lang.ICloneable {
            public getString(key: string): string;
            public describeContents(): number;
            public writeToParcel(parcel: android.os.Parcel, flags: number): void;
        }
    }
}
