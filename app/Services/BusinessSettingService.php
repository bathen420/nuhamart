<?php

namespace App\Services;

use App\Models\BusinessSetting;
use App\Repositories\BusinessSettingRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BusinessSettingService
{
    private const IMAGE_FIELDS = [
        'logo', 'dark_logo', 'white_logo', 'footer_logo', 'mobile_logo',
        'admin_logo', 'login_logo', 'invoice_logo', 'pos_logo', 'email_logo',
        'favicon', 'og_image',
    ];

    public function __construct(private readonly BusinessSettingRepository $repository) {}

    public function getCurrent(): BusinessSetting
    {
        return $this->repository->getCurrent();
    }

    public function update(array $data, array $files = [], array $remove = []): BusinessSetting
    {
        return DB::transaction(function () use ($data, $files, $remove) {
            $setting = $this->repository->getCurrent();

            foreach (self::IMAGE_FIELDS as $field) {
                unset($data[$field], $data["remove_{$field}"]);

                if (($remove[$field] ?? false) && $setting->{$field}) {
                    $this->deleteStoredFile($setting->{$field});
                    $data[$field] = null;
                }

                if (($files[$field] ?? null) instanceof UploadedFile) {
                    if ($setting->{$field}) {
                        $this->deleteStoredFile($setting->{$field});
                    }

                    $data[$field] = $files[$field]->store('business/branding', 'public');
                }
            }

            foreach ([
                'tax_enabled', 'cod_enabled', 'bkash_enabled', 'nagad_enabled',
                'bank_enabled', 'sslcommerz_enabled', 'store_pickup_enabled',
                'steadfast_enabled',
            ] as $booleanField) {
                $data[$booleanField] = (bool) ($data[$booleanField] ?? false);
            }

            return $this->repository->update($setting, $data);
        });
    }

    private function deleteStoredFile(?string $path): void
    {
        if (! $path) {
            return;
        }

        if (str_starts_with($path, '/uploads/')) {
            @unlink(public_path(ltrim($path, '/')));
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
