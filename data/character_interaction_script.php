<?php

$files = glob('../books/*.{txt}', GLOB_BRACE);
foreach ($files as $file) {
    echo $file;
    $text = file_get_contents($file);
    $text = preg_replace('/".*?"/m', '', $text);
    $chapters = explode("CHAPTER", $text);
    if (count($chapters) == 1) {
        $chapters = explode("Chapter", $text);
    }
    $characters = [
        "Hannah Abbott",
        "Ludo Bagman",
        "Lavender Brown",
        "Pince",
        "Pomfrey",
        "Harry Potter",
        "James Potter",
        "Lily Potter",
        "Quirrell",
        "Millicent Bulstrode",
        "Helena Ravenclaw",
        "Tom Riddle",
        "Voldemort",
        "Augustus Rookwood",
        "Rufus Scrimgeour",
        "Kingsley Shacklebolt",
        "Charity Burbage",
        "Stan Shunpike",
        "Rita Skeeter",
        "Slughorn",
        "Hepzibah Smith",
        "Zacharias Smith",
        "Snape",
        "Alicia Spinnet",
        "Sprout",
        "Pius Thicknesse",
        "Frank Bryce",
        "Dean Thomas",
        "Andromeda Tonks",
        "Nymphadora Tonks",
        "Tonks",
        "Ted Tonks",
        "Trelawney",
        "Umbridge",
        "Romilda Vane",
        "Arthur Weasley",
        "Alecto Carrow",
        "Bill Weasley",
        "Mr. Weasley",
        "Charlie Weasley",
        "Fred Weasley",
        "George Weasley",
        "Ginny Weasley",
        "Molly Weasley",
        "Mrs. Weasley",
        "Percy Weasley",
        "Ron Weasley",
        "Oliver Wood",
        "Blaise Zabini",
        "Amycus Carrow",
        "Aragog",
        "Bane",
        "Bloody Baron",
        "Buckbeak",
        "Cadogan",
        "Crookshanks",
        "Dobby",
        "Fang",
        "Reginald Cattermole",
        "Fawkes",
        "Firenze",
        "Fluffy",
        "Grawp",
        "Griphook",
        "Hedwig",
        "Kreacher",
        "Moaning Myrtle",
        "Mrs. Norris",
        "Nagini",
        "Mrs. Cattermole",
        "Headless Nick",
        "Norbert",
        "Peeves",
        "Rosmerta",
        "Scabbers",
        "Trevor",
        "Winky",
        "Wormtail",
        "Cho Chang",
        "Penelope Clearwater",
        "Bathilda Bagshot",
        "Michael Corner",
        "Vincent Crabbe, Sr.",
        "Crabbe",
        "Colin Creevey",
        "Dirk Cresswell",
        "Barty Crouch",
        "Mr. Crouch",
        "Fleur Delacour",
        "Gabrielle Delacour",
        "Dedalus Diggle",
        "Katie Bell",
        "Amos Diggory",
        "Cedric Diggory",
        "Elphias Doge",
        "Antonin Dolohov",
        "Aberforth Dumbledore",
        "Albus Dumbledore",
        "Ariana Dumbledore",
        "Dudley Dursley",
        "Binns",
        "Marge Dursley",
        "Petunia Dursley",
        "Vernon Dursley",
        "Marietta Edgecombe",
        "Mrs. Figg",
        "Filch",
        "Justin Finch-Fletchley",
        "Seamus Finnigan",
        "Regulus Black",
        "Mundungus Fletcher",
        "Flitwick",
        "Fudge",
        "Marvolo Gaunt",
        "Merope Gaunt",
        "Morfin Gaunt",
        "Anthony Goldstein",
        "Goyle",
        "Hermione Granger",
        "Sirius Black",
        "Gregorovitch",
        "Fenrir Greyback",
        "Gellert Grindelwald",
        "Grubbly-Plank",
        "Hagrid",
        "Hooch",
        "Angelina Johnson",
        "Lee Jordan",
        "Amelia Bones",
        "Karkaroff",
        "Krum",
        "Bellatrix Lestrange",
        "Gilderoy Lockhart",
        "Alice Longbottom",
        "Augusta Longbottom",
        "Frank Longbottom",
        "Neville Longbottom",
        "Susan Bones",
        "Luna Lovegood",
        "Xenophilius Lovegood",
        "Lupin",
        "Teddy Lupin",
        "Draco Malfoy",
        "Malfoy",
        "Lucius Malfoy",
        "Narcissa Malfoy",
        "Maxime",
        "Ernie Macmillan",
        "McGonagall",
        "Terry Boot",
        "Cormac McLaggen",
        "Moody",
        "Theodore Nott",
        "Ollivander",
        "Pansy Parkinson",
        "Padma Patil",
        "Parvati Patil",
        "Pettigrew"
    ];
    $inBook = [];
    for ($i = 1; $i < count($chapters); $i++) {
        echo $i . "<br>";
        $chapter_text = $chapters[$i];
        $chapterChars = [];
        foreach ($characters as $name) {
            $splitName = explode(" ", $name);
            $firstName = $splitName[0] . " ";
            if (strpos($chapter_text, $name)) {
                if(!(in_array("Draco Malfoy", $chapterChars) && strcmp("Malfoy", $name) == 0)
                && !(in_array("Malfoy", $chapterChars) && strcmp("Draco Malfoy", $name) == 0)){
                    echo $name . "<br>";
                    array_push($chapterChars, $name);
                    array_push($inBook, $name);
                }
            } else if (strpos($chapter_text, $firstName)) {
                $mr = strcmp("Mr.", substr($firstName, 0, 3));
                $mrs = strcmp("Mrs.", substr($firstName, 0, 4));
                $tom = strcmp("Tom ", $firstName);
                if ($mr != 0 && $mrs != 0 && $tom != 0) {
                    echo $name . "<br>";
                    array_push($chapterChars,$name);
                    array_push($inBook, $name);
                }
            }
        }
    }
    echo '******'. count(array_unique($inBook));
}