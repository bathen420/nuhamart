<?php
use Illuminate\Database\Migrations\Migration; use Illuminate\Database\Schema\Blueprint; use Illuminate\Support\Facades\Schema;
return new class extends Migration { public function up():void { Schema::create('units',function(Blueprint $t){$t->id();$t->string('name');$t->string('short_name',20)->unique();$t->boolean('is_base')->default(false);$t->boolean('status')->default(true)->index();$t->timestamps();$t->softDeletes();}); } public function down():void {Schema::dropIfExists('units');}};
