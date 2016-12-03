import java.io.*;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
public class PotterPlots {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		 // The name of the file to open.
        //parseForWordCount();
		//writeChapterNames();
		writeBattleEvents();
		
		
	}
	public static void writeBattleEvents()
	{
		String jsonData = "";
		String axisData = "\n\"axis\": [";
		Map nameMap = new HashMap();
		BufferedReader br = null;
		try {
			String line;
			br = new BufferedReader(new FileReader("data/battledata.txt"));
			jsonData += "{\"battles\":[{\"events\":[";
			while ((line = br.readLine()) != null) {
				String[] words = line.split("-");
				if(line.compareTo("EndBattle")==0)
				{
					jsonData +="]},{\"battles\":[{\"events\":[";
					
				}
				else
				{
					jsonData+="{\"type\":\""+words[0]+"\"";
					//System.out.println(jsonData);
					if(words[0].compareTo("Entry")==0)
					{
						jsonData+=",\"name\":\""+words[1]+"\"";
						jsonData+=",\"side\":\""+words[2]+"\"";
						jsonData+=",\"mod\":\""+words[3]+"\"";
					}
					else if(words[0].compareTo("Exit")==0)
					{
						jsonData+=",\"name\":\""+words[1]+"\"";
						jsonData+=",\"reason\":\""+words[2]+"\"";
					}
					else if(words[0].compareTo("Spell")==0)
					{
						jsonData+=",\"spell\":\""+words[1]+"\"";
						jsonData+=",\"caster\":\""+words[2]+"\"";
						jsonData+=",\"target\":\""+words[3]+"\"";
					}
					else if(words[0].compareTo("MSpell")==0)
					{
						jsonData+=",\"spell\":\""+words[1]+"\"";
						jsonData+=",\"caster\":\""+words[2]+"\"";
						//jsonData+=",\"target\":\""+words[3]+"\"";
					}
					else if(words[0].compareTo("MSpell")==0)
					{
						jsonData+=",\"specialType\":\""+words[1]+"\"";
					}
					jsonData+="},";
				}
				//System.out.println(jsonData);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		try{
			
			
            JSONObject jsonObject =  new JSONObject();
			PrintWriter cWriter = new PrintWriter("data/BattleDataNew.json", "UTF-8");
			cWriter.println(jsonData);
			System.out.println(jsonData);
			System.out.println("data written");
			cWriter.close();
			
		}
		catch(Exception e)
		{
			System.out.println(e);
		}
	}
	public static void writeChapterNames()
	{
		String jsonData = "";
		String axisData = "\n\"axis\": [";
		Map nameMap = new HashMap();
		BufferedReader br = null;
		try {
			String line;
			br = new BufferedReader(new FileReader("data/chapterLocations.txt"));
			jsonData += "{\"books\":[{\"chapters\":[";
			while ((line = br.readLine()) != null) {
				String[] words = line.split(",");
				if(line.compareTo("END")==0)
				{
					jsonData +="],";
					Set keys = nameMap.keySet();

					for (Iterator z = keys.iterator(); z.hasNext(); ) {
					       String key = (String) z.next();
					       String value = (String) nameMap.get(key);
					       axisData+="\""+value+"\",";
					}
					axisData += "]}";
					jsonData += axisData;
					axisData = "\n\"axis\": [";
					nameMap = new HashMap();
					jsonData += ",\n{\"chapters\":[";
					
					continue;
				}
				jsonData+="{\"locations\":[";
				System.out.println(jsonData);
				for(int i=0;i<words.length;i++)
				{
					jsonData += "\""+words[i]+"\"";
					nameMap.put(words[i], words[i]);
					if(i!=words.length-1)
						jsonData +=",";
				}
				jsonData+="]},\n";
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		try{
			
			
            JSONObject jsonObject =  new JSONObject();
			PrintWriter cWriter = new PrintWriter("chapterLocationsNew.txt", "UTF-8");
			cWriter.println(jsonData);

			cWriter.close();
			
		}
		catch(Exception e)
		{
			System.out.println(e);
		}
	}
	public static void parseForWordCount()
	{
		String[] fileName = {"sorcerers_stone.txt","chamber_of_secrets.txt","prisoner_of_azkaban.txt",
        		"goblet_of_fire.txt","order_of_the_phoenix.txt","half_blood_prince.txt","deathly_hallows.txt"};

        // This will reference one line at a time
		int chapterCountAll = 0;
        String line = null;
        int[][] chapterWordCount = new int[7][50];
        String[][] allLocations = new String[100][2];
        String[][][] chapterLocations = new String[7][50][10];
        int[] chapterCount = new int [7];
        int readIndex = 0;
        boolean[] locationExists = new boolean[100];
        try {
		    // FileReader reads text files in the default encoding.
		    FileReader fileReader = 
		        new FileReader("data/locations.txt");
		    // Always wrap FileReader in BufferedReader.
		    BufferedReader bufferedReader = 
		        new BufferedReader(fileReader);
		    
		    while((line = bufferedReader.readLine()) != null)
		    {
		    	allLocations[readIndex][1] = line;
		    	locationExists[readIndex] = false;
		    	readIndex++;
		    	
		    }
        }
        catch(Exception e)
        {
        	System.out.println(e);
        }
        
        
        for(int i=0;i< fileName.length; i++)
        {
			try {
			    // FileReader reads text files in the default encoding.
			    FileReader fileReader = 
			        new FileReader(fileName[i]);
			    // Always wrap FileReader in BufferedReader.
			    BufferedReader bufferedReader = 
			        new BufferedReader(fileReader);
			    int chapterNum  = 0;
			    int locationIndex = 0;
			    
			    while((line = bufferedReader.readLine()) != null) {
			        
			    	String[] words = line.split("\\s");
			        
			        if((words[0].compareTo("CHAPTER") == 0)||(words[0].compareTo("Chapter") == 0)||(words[0].compareTo("Epilogue") == 0))
			        {
			        	System.out.println(i+" "+chapterNum+" ");
			        	for(int x=0;x<locationIndex;x++)
			        	{
			        		System.out.print(chapterLocations[i][chapterNum][x]+" ");
			        	}
			        	System.out.println("\n");
			        	for(int y=0;y<readIndex;y++)
			        		locationExists[y] = false;
			        	chapterNum ++;
			        	locationIndex = 0;   	
			        	
			        }
			        if((words[0].compareTo("Epilogue") == 0))
		        	{
			        	chapterNum++;
			        	locationIndex = 0;
			        	
		        	}
			        for(int j=0;j<readIndex;j++)
			        {
			        	if(line.toLowerCase().contains(allLocations[j][1].toLowerCase()))
			        		{
			        			if(locationIndex <10&&!locationExists[j])
			        			{
			        				locationExists[j] = true;
			        				chapterLocations[i][chapterNum][locationIndex] = allLocations[j][1];
			        				locationIndex++;
			        			}
			        		}
			
			        	
			        }
			        
			    }    
			    chapterCount[i]=chapterNum;
			    chapterCountAll+= chapterNum;
			      
			     
			
			    // Always close files.
			    bufferedReader.close();         
			}
			catch(FileNotFoundException ex) {
			    System.out.println(
			        "Unable to open file '" + 
			        fileName + "'");                
			}
			catch(IOException ex) {
			    System.out.println(
			        "Error reading file '" 
			        + fileName + "'");                  
			    // Or we could just do this: 
			    // ex.printStackTrace();
			}
        }
        
        System.out.println(chapterCountAll);
	}
	
	public static void readJSON(int[][] chapterWordCount, String[][] chapterNames, int[] chapterCount) {
		 JSONParser parser = new JSONParser();
		 JSONArray books = new JSONArray();
	        try {     
	            JSONArray jsonObject = (JSONArray) parser.parse(new FileReader("data/books.json"));
	            
	            for(int i=0;i<7;i++)
	            {
	            	
	            	JSONObject book = (JSONObject)jsonObject.get(i);
	            	//JSONArray chapters = (JSONArray)book.get("chapters");
	            	//System.out.println(book);
	            	JSONArray chapters = new JSONArray();
	            	for(int j=0;j<chapterCount[i];j++)
	            	{
	            		JSONObject chapter = new JSONObject();
	            		chapter.put("word_count", chapterWordCount[i][j+1]);
	            		chapter.put("name", chapterNames[i][j+1]);
	            		chapter.put("horcruxes", new JSONArray());
	            		chapter.put("battles", new JSONArray());
	            		chapter.put("interactions", new JSONArray());
	            		
	            		
	            		
	            		chapters.add(chapter);
	            	}
	            	book.put("chapters",chapters);
	            	
	            	books.add(book);
	            }
	            

	        } catch (FileNotFoundException e) {
	            e.printStackTrace();
	        } catch (IOException e) {
	            e.printStackTrace();
	        } catch (ParseException e) {
	            e.printStackTrace();
	        }
	        try{
	            PrintWriter writer = new PrintWriter("books.json", "UTF-8");
	            writer.println("[");
	            for(int i =0;i<books.size();i++)
	            {
	            	
	            	writer.println(books.get(i));
	            	if(i!=books.size()-1)
	            		writer.print(",");
	            		
	            }
	            writer.println("]");
	           
	            writer.close();
	        } catch (Exception e) {
	           // do something
	        }
	    
		
	}

}
