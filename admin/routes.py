from flask import Blueprint, render_template, request, redirect, url_for, json
from flask_login import login_user, logout_user, login_required, current_user
from pathlib import Path
import validators
from config import Config
from models import User
from utils import save_json_data, load_json_data
import re

admin_bp = Blueprint(
    "admin", __name__, template_folder="templates", static_folder="static"
)


@admin_bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("admin.dashboard"))

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        user = User()
        if username == user.username and password == user.password:
            login_user(user)
            return redirect(url_for("admin.dashboard"))

    return render_template("login.html")


@admin_bp.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("admin.login"))


@admin_bp.route("/")
@login_required
def dashboard():
    data = {
        "timetable": load_json_data(Config.DATA_FILES["timetable"]),
        "buttons": load_json_data(Config.DATA_FILES["buttons"]),
        "names": load_json_data(Config.DATA_FILES["names"]),
    }
    return render_template("dashboard.html", data=data)


@admin_bp.route("/timetable", methods=["GET", "POST"])
@login_required
def timetable():
    file_path = Config.DATA_FILES["timetable"]

    if request.method == "POST":
        days = request.form.getlist("days[]")
        section_names = request.form.getlist("section_name[]")

        sections = []
        for section_idx in range(len(section_names)):
            courses = []
            for day_idx in range(len(days)):
                course = request.form.get(f"courses[{section_idx}][{day_idx}]", "")
                courses.append(course)
            sections.append({"name": section_names[section_idx], "courses": courses})

        timetable_data = {"days": days, "sections": sections}

        save_json_data(file_path, timetable_data)
        return redirect(url_for("admin.timetable"))

    data = load_json_data(file_path)
    return render_template("timetable.html", data=data)


@admin_bp.route("/buttons", methods=["GET", "POST"])
@login_required
def buttons():
    file_path = Config.DATA_FILES["buttons"]

    if request.method == "POST":
        buttons = []
        titles = request.form.getlist("title[]")
        action_types = request.form.getlist("action_type[]")
        action_values = request.form.getlist("action_value[]")
        targets = request.form.getlist("target[]")
        classes = request.form.getlist("class[]")

        for i in range(len(titles)):
            btn_data = {
                "text": titles[i],
                "class": classes[i],
                "target": targets[i] if targets[i] != "_self" else None,
            }

            if action_types[i] == "link":
                href = action_values[i].strip()
                if href and not href.startswith(("http://", "https://")):
                    href = "/" + href.lstrip("/")
                btn_data["href"] = href
            else:
                btn_data["onclick"] = action_values[i].strip()

            buttons.append(btn_data)

        save_json_data(file_path, {"buttons": buttons})
        return redirect(url_for("admin.buttons"))

    data = load_json_data(file_path)
    buttons = data.get("buttons", [])
    return render_template("buttons.html", buttons=buttons)


def parse_names(input_text):
    cleaned = input_text.replace('"', "").replace("'", "").strip()

    if "\n" in cleaned:
        return [n.strip() for n in cleaned.split("\n") if n.strip()]
    elif "，" in cleaned:
        return [n.strip() for n in cleaned.split("，") if n.strip()]
    elif "," in cleaned:
        return [n.strip() for n in cleaned.split(",") if n.strip()]

    return [cleaned] if cleaned else []


@admin_bp.route("/names", methods=["GET", "POST"])
@login_required
def names():
    if request.method == "POST":

        table_names = request.form.getlist("table_names[]")
        text_names = parse_names(request.form.get("text_names", ""))

        merged_names = list({n.strip() for n in table_names + text_names if n.strip()})

        save_json_data(Config.DATA_FILES["names"], {"names": merged_names})

    data = load_json_data(Config.DATA_FILES["names"])
    names = data.get("names", [])
    return render_template("names.html", names=names)


@admin_bp.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory(current_app.config["STATIC_FOLDER"], filename)
