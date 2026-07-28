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
        $setting->update($data);

        return $setting->fresh();
    }
}
