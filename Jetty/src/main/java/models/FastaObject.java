package models;

import java.io.Serializable;
import java.util.List;

public class FastaObject implements Serializable{
	private static final long serialVersionUID = -7935537499853732631L;
	
	String db, accession, description, amino;

	public String getDb() {
		return db;
	}

	public void setDb(String db) {
		this.db = db;
	}

	public String getAccession() {
		return accession;
	}

	public void setAccession(String accession) {
		this.accession = accession;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAmino() {
		return amino;
	}

	public void setAmino(String amino) {
		this.amino = amino;
	}

	@Override
	public String toString() {
		return "FastaObject [db=" + db + ", accession=" + accession + ", description=" + description + ", amino="
				+ amino + "]";
	}

	
}
