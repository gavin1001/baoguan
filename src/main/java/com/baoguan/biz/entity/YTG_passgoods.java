package com.baoguan.biz.entity;

import java.util.List;

public class YTG_passgoods {
    private String countryNAme;
    private String data;
    private String locationCode;
    private String locationName;
    private List<com.baoguan.biz.entity.Goods> rows;
    private String total;

    public String getCountryNAme() {
        return countryNAme;
    }

    public void setCountryNAme(String countryNAme) {
        this.countryNAme = countryNAme;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getLocationCode() {
        return locationCode;
    }

    public void setLocationCode(String locationCode) {
        this.locationCode = locationCode;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public List<Goods> getRows() {
        return rows;
    }

    public void setRows(List<Goods> rows) {
        this.rows = rows;
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }
}
