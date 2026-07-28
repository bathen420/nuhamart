<?php

namespace App\Services;

use App\Models\BusinessSetting;
use App\Repositories\BusinessSettingRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class BusinessSettingService
{
    public function __construct(private readonly BusinessSettingRepository $repository)
    {
    }

    public function getCurrent(): BusinessSetting
    {
        return $this->repository->getCurrent();
    }

    public function update(array $data, ?UploadedFile $logo = null, bool $removeLogo = false): BusinessSetting
    {
        return DB::transaction(function () use ($data, $logo, $removeLogo) {
            $setting = $this->repository->getCurrent();
            unset($data['logo'], $data['remove_logo']);

            if ($removeLogo && $setting->logo) {
                $this->deleteLogo($setting->logo);
                $data['logo'] = null;
            }

            if ($logo) {
                if ($setting->logo) {
                    $this->deleteLogo($setting->logo);
                }

                $directory = public_path('uploads/business');
                File::ensureDirectoryExists($directory);
                $filename = 'logo-' . Str::uuid() . '.' . $logo->getClientOriginalExtension();
                $logo->move($directory, $filename);
                $data['logo'] = '/uploads/business/' . $filename;
            }

            return $this->repository->update($setting, $data);
        });
    }

    private function deleteLogo(string $path): void
    {
        $fullPath = public_path(ltrim($path, '/'));
        if (File::exists($fullPath)) {
            File::delete($fullPath);
        }
    }
}
