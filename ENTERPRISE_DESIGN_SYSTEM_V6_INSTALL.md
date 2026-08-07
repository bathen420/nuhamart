# Nuha Mart BD — Enterprise Design System v6.0

This is the visual foundation for the full Admin UI redesign.

## Included

### Design tokens

- NuhaMart brand palette
- Neutral/ink palette
- Typography scale
- Radius system
- Shadow system
- Animation primitives
- Focus and accessibility defaults

### Reusable admin UI

```text
resources/js/Components/Admin/UI/
```

Components:

- Button
- Card
- Badge
- FormField
- Input
- Select
- Textarea
- Toggle
- Alert
- PageHeader
- StatCard
- Table primitives
- EmptyState
- Skeleton

### Backward-compatible upgrades

The existing components below now use the new design language:

- PrimaryButton
- SecondaryButton
- DangerButton
- TextInput
- InputLabel
- InputError
- Checkbox
- Modal

Existing pages continue to work while they are migrated gradually.

## Install

```powershell
cd C:\Users\HP\nuhamart

Expand-Archive `
-Path .\NuhaMart-Enterprise-Design-System-v6.0.zip `
-DestinationPath . `
-Force

php artisan optimize:clear
npm run build
```

## Verification

```powershell
php artisan test
php artisan nuhamart:health-check
npm run build
```

Open several existing admin forms and modal dialogs. Buttons, inputs, errors,
checkboxes and modal windows should immediately use the new visual system.

## Usage example

```jsx
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    FormField,
    Input,
    PageHeader,
    StatCard,
} from "@/Components/Admin/UI";
```

```jsx
<PageHeader
    eyebrow="Catalog"
    title="Products"
    description="Manage your complete product catalog."
    actions={<Button>Add Product</Button>}
/>

<Card>
    <CardHeader title="Product information" />
    <CardBody>
        <FormField label="Product name" error={errors.name}>
            <Input
                value={data.name}
                onChange={(event) => setData("name", event.target.value)}
                invalid={Boolean(errors.name)}
            />
        </FormField>
    </CardBody>
</Card>
```

## Rollback

Restore these files from version control or your project backup:

```text
tailwind.config.js
resources/css/app.css
resources/js/Components/PrimaryButton.jsx
resources/js/Components/SecondaryButton.jsx
resources/js/Components/DangerButton.jsx
resources/js/Components/TextInput.jsx
resources/js/Components/InputLabel.jsx
resources/js/Components/InputError.jsx
resources/js/Components/Checkbox.jsx
resources/js/Components/Modal.jsx
```

Then remove:

```text
resources/js/Components/Admin/UI
resources/js/lib/cn.js
```

## Next phase

Enterprise Admin Layout v6.1:

- Premium dark sidebar
- Responsive mobile navigation
- Top header
- Command search
- Workspace navigation
- Notification and profile controls
