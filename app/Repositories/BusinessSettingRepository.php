<?php

namespace App\Repositories;

use App\Models\BusinessSetting;

class BusinessSettingRepository
{
    public function getCurrent(): BusinessSetting
    {
        return BusinessSetting::current();
    }

    public function update(BusinessSetting $setting, array $data): BusinessSetting
    {
        $setting->fill($data)->save();
        BusinessSetting::clearCache();

        return BusinessSetting::current();
    }
}
