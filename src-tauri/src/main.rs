use serde::{Deserialize, Serialize};
use rusqlite::{Connection, params};
use std::path::PathBuf;
use tauri::command;
use dirs;

#[derive(Debug, Serialize, Deserialize)]
struct Book {
    id: String,
    title: String,
    author: String,
    path: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Annotation {
    book_id: String,
    text: Option<String>, // Changed to Option<String> to handle NULL values
    note: Option<String>, // Changed to Option<String> to handle NULL values
}

#[derive(Debug, Serialize, Deserialize)]
struct IBooksData {
    books: Vec<Book>,
    annotations: Vec<Annotation>,
}

fn get_ibooks_path() -> PathBuf {
    let home_dir = dirs::home_dir().expect("Failed to get home directory");
    home_dir.join("Library/Containers/com.apple.iBooksX/Data/Documents/")
}

#[command]
async fn get_ibooks_data() -> Result<IBooksData, String> {
    let ibooks_path = get_ibooks_path();
    let bk_library_path = ibooks_path.join("BKLibrary/BKLibrary-1-091020131601.sqlite");
    let ae_annotation_path = ibooks_path.join("AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite");

    if !bk_library_path.exists() || !ae_annotation_path.exists() {
        return Err("SQLite files not found".to_string());
    }

    let books = match parse_bk_library(&bk_library_path) {
        Ok(books) => books,
        Err(e) => return Err(format!("Failed to parse BKLibrary: {}", e)),
    };

    let annotations = match parse_ae_annotation(&ae_annotation_path) {
        Ok(annotations) => annotations,
        Err(e) => return Err(format!("Failed to parse AEAnnotation: {}", e)),
    };

    Ok(IBooksData { books, annotations })
}

fn parse_bk_library(path: &PathBuf) -> Result<Vec<Book>, rusqlite::Error> {
    let conn = Connection::open(path)?;
    let mut stmt = conn.prepare("SELECT ZASSETID, ZTITLE, ZAUTHOR, ZPATH FROM ZBKLIBRARYASSET")?;
    
    let books = stmt.query_map([], |row| {
        Ok(Book {
            id: row.get(0)?,
            title: row.get(1)?,
            author: row.get(2)?,
            path: row.get(3)?,
        })
    })?.collect::<Result<Vec<_>, _>>()?;
    
    Ok(books)
}

fn parse_ae_annotation(path: &PathBuf) -> Result<Vec<Annotation>, rusqlite::Error> {
    let conn = Connection::open(path)?;
    let mut stmt = conn.prepare("SELECT ZANNOTATIONASSETID, ZANNOTATIONSELECTEDTEXT, ZANNOTATIONNOTE FROM ZAEANNOTATION")?;
    
    let annotations = stmt.query_map([], |row| {
        Ok(Annotation {
            book_id: row.get(0)?,
            text: row.get(1)?,
            note: row.get(2)?,
        })
    })?.collect::<Result<Vec<_>, _>>()?;
    
    Ok(annotations)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_ibooks_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}