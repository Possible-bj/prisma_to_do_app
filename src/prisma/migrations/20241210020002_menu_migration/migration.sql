-- CreateTable
CREATE TABLE "MenuOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "max_selection" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "menu_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "multiple_selection" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MenuOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuOption_id_key" ON "MenuOption"("id");

-- AddForeignKey
ALTER TABLE "MenuOption" ADD CONSTRAINT "MenuOption_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuOption" ADD CONSTRAINT "MenuOption_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
