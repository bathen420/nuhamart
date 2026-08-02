<?php
namespace App\Models\Concerns;

trait HasLocalizedContent
{
    public function localized(string $attribute): mixed
    {
        if (app()->getLocale() === 'bn') {
            $value = $this->getAttribute($attribute.'_bn');
            if ($value !== null && $value !== '') return $value;
        }
        return $this->getAttribute($attribute);
    }
}
