import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Seeder } from "nestjs-seeder";
import { Setting } from "src/modules/settings/entities/setting.entity";
import { SettingsService } from "src/modules/settings/settings.service";
import { Repository } from "typeorm";

@Injectable()
export class SettingsSeeder implements Seeder {
    constructor(
        @InjectRepository(Setting) private settingRepository: Repository<Setting>,
    ) {}

    async seed(): Promise<any> {
        const setting: Setting = {
            id: '1',
            openViduRecord: true,
            openViduRecordingMode: "MANUAL",
            openViduRecordingWidth: 1280,
            openViduRecordingHeight: 720,
            openViduRecordingLayout: "BEST_FIT",
            openViduRecordingFrameRate: 25
        }

        const settingI = this.settingRepository.create(setting);
        return this.settingRepository.insert(settingI);
    }

    async drop(): Promise<any> {
        const rows = await this.settingRepository.find();
        // this.settingRepository.r(rows);
    }
}