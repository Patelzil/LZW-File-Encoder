// CLASS: Encoder
//
// Author: Patel Zil, 7876456
//
// REMARKS: reads in the file to be compresses
//          and outputs the compressed data to a 
//          .lzw file
//
//-----------------------------------------

'use strict';
let Dictionary = require('./Dictionary.js');
let StringHash = require('./StringHash.js');
let fs = require('fs');

class Encoder
{
    constructor(fileName)
    {
        this._file = fileName;
        this.load();
    }

    /*encode
     *Purpose - opens a new output file (.lzw ext.), opens the input file
     *          and implements LZW algorithm.
     */
    encode()
    {
        this.output = this._file + ".lzw";
        fs.writeFileSync(this.output, "") // open the .lzw file
        this.contents = fs.readFileSync(this._file,"utf-8");

        this.index = 0; // used inside the loop
        this.number = 95;
        this.curr_key = this.contents[this.index];
        this.temp = new StringHash(this.curr_key);

        while(this._myDictionary.contains(this.temp) && this.index < this.contents.length)
        {
            
            this.last_key = this.curr_key;
            this.curr_key += this.contents[this.index+1];
            this.temp = new StringHash(this.curr_key);

            if(!this._myDictionary.contains(this.temp))
            {
                this._myDictionary.put(this.temp,this.number);
                fs.appendFileSync(this.output, (this._myDictionary.get(new StringHash(this.last_key)))+" ");
            }
            else // if the key is already in the dictionary then take the next character from the file and continue the algorithm
            {
                this.index++;
                this.last_key = this.curr_key;
                this.curr_key += this.contents[this.index+1];
                this.temp = new StringHash(this.curr_key);
                this._myDictionary.put(this.temp,this.number);
                fs.appendFileSync(this.output, (this._myDictionary.get(new StringHash(this.last_key)))+" ");
            }

            this.curr_key = this.curr_key.charAt(this.curr_key.length-1);
            this.index++;
            this.number++;
        }
        fs.appendFileSync(this.output, -1);
    }// end encode

    /*load
     *Purpose - creates and fills the dictionary with the character and its LZW encoding
     */
    load()
    {
        this._myDictionary = new Dictionary();
        for(let i=32; i<=126; i++)
        {
            let tempHash = new StringHash(String.fromCharCode(i));
            this._myDictionary.put(tempHash,(i-32));
        }
    }// end loadCodes
}// end class

module.exports = Encoder;